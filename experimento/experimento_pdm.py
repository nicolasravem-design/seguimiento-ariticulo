# -*- coding: utf-8 -*-
"""
Experimento reproducible de mantenimiento predictivo con Machine Learning.

Genera un conjunto de datos sintetico siguiendo el procedimiento de generacion
documentado por Matzka (2020) para el AI4I 2020 Predictive Maintenance Dataset
y entrena tres clasificadores supervisados para predecir la falla de maquina.

IMPORTANTE: los datos NO son el archivo original del repositorio UCI; son una
reimplementacion del generador descrito en la publicacion. Dos parametros que la
publicacion no cuantifica (la potencia nominal de referencia y la desviacion del
ruido sobre la velocidad de rotacion) se calibraron en POTENCIA_NOMINAL_W = 6500
y RUIDO_VELOCIDAD_RPM = 200 para reproducir de forma aproximada la prevalencia de
falla documentada (~3,4 %). Los resultados que produce este script son
exactamente los que se reportan en el articulo y en la pagina web.

Uso:
    python3 experimento/experimento_pdm.py

Salidas:
    assets/resultados.json   metricas y metadatos para la web y el articulo
    experimento/resultados.md  tabla en markdown
"""

import json
import os
import numpy as np
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    average_precision_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import (
    StratifiedKFold,
    cross_val_predict,
    cross_val_score,
    train_test_split,
)
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

SEMILLA = 42
N = 10_000
POTENCIA_NOMINAL_W = 6500.0
RUIDO_VELOCIDAD_RPM = 200.0
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def generar_datos(n=N, semilla=SEMILLA):
    """Reimplementa el generador descrito en Matzka (2020)."""
    rng = np.random.default_rng(semilla)

    # Variante de calidad del producto: L 50%, M 30%, H 20%
    calidad = rng.choice(["L", "M", "H"], size=n, p=[0.5, 0.3, 0.2])

    # Temperatura del aire [K]: caminata aleatoria normalizada a sigma = 2 K
    # alrededor de 300 K.
    caminata = np.cumsum(rng.normal(0, 1, n))
    caminata = (caminata - caminata.mean()) / caminata.std()
    temp_aire = 300.0 + 2.0 * caminata

    # Temperatura de proceso [K]: temperatura del aire + 10 K, con sigma = 1 K.
    ruido = rng.normal(0, 1, n)
    temp_proceso = temp_aire + 10.0 + 1.0 * (ruido - ruido.mean()) / ruido.std()

    # Par [Nm]: normal alrededor de 40 Nm, sigma = 10, sin valores negativos.
    par = np.maximum(rng.normal(40, 10, n), 3.5)

    # Velocidad de rotacion [rpm]: derivada de una potencia nominal de referencia
    # y del par de cada pieza, con ruido gaussiano superpuesto. Se acota al rango
    # observado en el conjunto original (1168-2886 rpm).
    vel_rotacion = POTENCIA_NOMINAL_W / (par * 2 * np.pi / 60.0)
    vel_rotacion = np.clip(
        vel_rotacion + rng.normal(0, RUIDO_VELOCIDAD_RPM, n), 1168, 2886
    )

    # Desgaste de herramienta [min]: H/M/L suman 5/3/2 minutos por pieza.
    incremento = np.where(calidad == "H", 5, np.where(calidad == "M", 3, 2))
    desgaste = np.zeros(n)
    twf = np.zeros(n, dtype=bool)
    acumulado = 0.0
    for i in range(n):
        acumulado += incremento[i]
        # La herramienta se sustituye o falla en un punto de desgaste elegido al
        # azar entre 200 y 240 min; la mitad de esos eventos se marca como falla
        # por desgaste de herramienta (TWF).
        if acumulado > rng.uniform(200, 240):
            if rng.random() < 0.5:
                twf[i] = True
            acumulado = 0.0
        desgaste[i] = acumulado

    # Modos de falla documentados (TWF ya se determino arriba)
    hdf = ((temp_proceso - temp_aire) < 8.6) & (vel_rotacion < 1380)
    potencia = par * vel_rotacion * 2 * np.pi / 60.0  # W
    pwf = (potencia < 3500) | (potencia > 9000)
    umbral_osf = np.where(calidad == "H", 13000, np.where(calidad == "M", 12000, 11000))
    osf = (desgaste * par) > umbral_osf
    rnf = rng.random(n) < 0.001

    falla = (twf | hdf | pwf | osf | rnf).astype(int)

    return pd.DataFrame(
        {
            "calidad": calidad,
            "temp_aire_K": np.round(temp_aire, 1),
            "temp_proceso_K": np.round(temp_proceso, 1),
            "vel_rotacion_rpm": np.round(vel_rotacion).astype(int),
            "par_Nm": np.round(par, 1),
            "desgaste_min": np.round(desgaste).astype(int),
            "falla": falla,
            "TWF": twf.astype(int),
            "HDF": hdf.astype(int),
            "PWF": pwf.astype(int),
            "OSF": osf.astype(int),
            "RNF": rnf.astype(int),
        }
    )


def construir_modelos():
    numericas = [
        "temp_aire_K",
        "temp_proceso_K",
        "vel_rotacion_rpm",
        "par_Nm",
        "desgaste_min",
    ]
    categoricas = ["calidad"]

    pre = ColumnTransformer(
        [
            ("num", StandardScaler(), numericas),
            ("cat", OneHotEncoder(handle_unknown="ignore"), categoricas),
        ]
    )

    return {
        "Regresión logística": Pipeline(
            [
                ("pre", pre),
                (
                    "clf",
                    LogisticRegression(
                        max_iter=2000, class_weight="balanced", random_state=SEMILLA
                    ),
                ),
            ]
        ),
        "Random Forest": Pipeline(
            [
                ("pre", pre),
                (
                    "clf",
                    RandomForestClassifier(
                        n_estimators=400,
                        min_samples_leaf=2,
                        class_weight="balanced_subsample",
                        random_state=SEMILLA,
                        n_jobs=-1,
                    ),
                ),
            ]
        ),
        "Gradient Boosting": Pipeline(
            [
                ("pre", pre),
                (
                    "clf",
                    GradientBoostingClassifier(random_state=SEMILLA),
                ),
            ]
        ),
    }


def main():
    df = generar_datos()
    X = df.drop(columns=["falla", "TWF", "HDF", "PWF", "OSF", "RNF"])
    y = df["falla"]

    X_tr, X_te, y_tr, y_te = train_test_split(
        X, y, test_size=0.30, stratify=y, random_state=SEMILLA
    )

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=SEMILLA)
    resultados = []
    mejor = (None, -1.0, None)

    for nombre, modelo in construir_modelos().items():
        f1_cv = cross_val_score(modelo, X_tr, y_tr, cv=cv, scoring="f1", n_jobs=-1)
        modelo.fit(X_tr, y_tr)
        pred = modelo.predict(X_te)
        proba = modelo.predict_proba(X_te)[:, 1]
        tn, fp, fn, tp = confusion_matrix(y_te, pred).ravel()

        fila = {
            "modelo": nombre,
            "exactitud": round(float(accuracy_score(y_te, pred)), 4),
            "precision": round(float(precision_score(y_te, pred, zero_division=0)), 4),
            "sensibilidad": round(float(recall_score(y_te, pred)), 4),
            "f1": round(float(f1_score(y_te, pred)), 4),
            "roc_auc": round(float(roc_auc_score(y_te, proba)), 4),
            "pr_auc": round(float(average_precision_score(y_te, proba)), 4),
            "f1_cv_media": round(float(f1_cv.mean()), 4),
            "f1_cv_desv": round(float(f1_cv.std()), 4),
            "matriz_confusion": {"vn": int(tn), "fp": int(fp), "fn": int(fn), "vp": int(tp)},
        }
        resultados.append(fila)
        if fila["f1"] > mejor[1]:
            mejor = (nombre, fila["f1"], modelo)

    # Ajuste del umbral de decision del mejor modelo. El barrido se hace sobre
    # predicciones out-of-fold del conjunto de entrenamiento (nunca sobre el de
    # prueba) y el umbral elegido se aplica despues al conjunto de prueba.
    proba_oof = cross_val_predict(
        mejor[2], X_tr, y_tr, cv=cv, method="predict_proba", n_jobs=-1
    )[:, 1]
    rejilla = np.linspace(0.05, 0.95, 91)
    f1_oof = [f1_score(y_tr, (proba_oof >= t).astype(int)) for t in rejilla]
    umbral = float(rejilla[int(np.argmax(f1_oof))])

    proba_te = mejor[2].predict_proba(X_te)[:, 1]
    pred_umbral = (proba_te >= umbral).astype(int)
    tn, fp, fn, tp = confusion_matrix(y_te, pred_umbral).ravel()
    ajuste_umbral = {
        "modelo": mejor[0],
        "umbral": round(umbral, 3),
        "f1_oof": round(float(max(f1_oof)), 4),
        "exactitud": round(float(accuracy_score(y_te, pred_umbral)), 4),
        "precision": round(float(precision_score(y_te, pred_umbral, zero_division=0)), 4),
        "sensibilidad": round(float(recall_score(y_te, pred_umbral)), 4),
        "f1": round(float(f1_score(y_te, pred_umbral)), 4),
        "matriz_confusion": {"vn": int(tn), "fp": int(fp), "fn": int(fn), "vp": int(tp)},
    }

    # Importancia por permutacion del mejor modelo (F1 como metrica objetivo)
    imp = permutation_importance(
        mejor[2], X_te, y_te, scoring="f1", n_repeats=15, random_state=SEMILLA, n_jobs=-1
    )
    importancias = sorted(
        (
            {"variable": col, "importancia": round(float(v), 4)}
            for col, v in zip(X.columns, imp.importances_mean)
        ),
        key=lambda d: d["importancia"],
        reverse=True,
    )

    salida = {
        "metadatos": {
            "n_registros": int(len(df)),
            "n_entrenamiento": int(len(X_tr)),
            "n_prueba": int(len(X_te)),
            "tasa_falla_pct": round(float(y.mean() * 100), 2),
            "semilla": SEMILLA,
            "validacion": "Hold-out 70/30 estratificado + validación cruzada 5-fold sobre entrenamiento",
            "origen_datos": "Generador sintético reimplementado a partir de Matzka (2020)",
            "version_sklearn": __import__("sklearn").__version__,
        },
        "distribucion_modos_falla": {
            modo: int(df[modo].sum()) for modo in ["TWF", "HDF", "PWF", "OSF", "RNF"]
        },
        "modelos": resultados,
        "mejor_modelo": mejor[0],
        "ajuste_umbral": ajuste_umbral,
        "importancia_permutacion": importancias,
    }

    os.makedirs(os.path.join(RAIZ, "assets"), exist_ok=True)
    ruta_json = os.path.join(RAIZ, "assets", "resultados.json")
    with open(ruta_json, "w", encoding="utf-8") as fh:
        json.dump(salida, fh, ensure_ascii=False, indent=2)

    lineas = [
        "# Resultados del experimento",
        "",
        f"- Registros: {salida['metadatos']['n_registros']} "
        f"(tasa de falla {salida['metadatos']['tasa_falla_pct']} %)",
        f"- Partición: {salida['metadatos']['validacion']}",
        f"- Mejor modelo por F1: **{salida['mejor_modelo']}**",
        "",
        "| Modelo | Exactitud | Precisión | Sensibilidad | F1 | ROC-AUC | PR-AUC | F1 (CV 5-fold) |",
        "|---|---|---|---|---|---|---|---|",
    ]
    for r in resultados:
        lineas.append(
            f"| {r['modelo']} | {r['exactitud']:.3f} | {r['precision']:.3f} | "
            f"{r['sensibilidad']:.3f} | {r['f1']:.3f} | {r['roc_auc']:.3f} | "
            f"{r['pr_auc']:.3f} | {r['f1_cv_media']:.3f} ± {r['f1_cv_desv']:.3f} |"
        )
    lineas += [
        "",
        "## Ajuste del umbral de decisión",
        "",
        f"Umbral seleccionado sobre predicciones out-of-fold: "
        f"**{ajuste_umbral['umbral']}** (por defecto 0.5).",
        "",
        "| Configuración | Precisión | Sensibilidad | F1 | Falsos negativos |",
        "|---|---|---|---|---|",
    ]
    base = next(r for r in resultados if r["modelo"] == mejor[0])
    lineas.append(
        f"| {mejor[0]} (umbral 0.5) | {base['precision']:.3f} | "
        f"{base['sensibilidad']:.3f} | {base['f1']:.3f} | "
        f"{base['matriz_confusion']['fn']} |"
    )
    lineas.append(
        f"| {mejor[0]} (umbral {ajuste_umbral['umbral']}) | "
        f"{ajuste_umbral['precision']:.3f} | {ajuste_umbral['sensibilidad']:.3f} | "
        f"{ajuste_umbral['f1']:.3f} | {ajuste_umbral['matriz_confusion']['fn']} |"
    )
    lineas += ["", "## Importancia por permutación (mejor modelo)", "", "| Variable | Importancia |", "|---|---|"]
    for i in importancias:
        lineas.append(f"| {i['variable']} | {i['importancia']:.4f} |")

    with open(os.path.join(RAIZ, "experimento", "resultados.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lineas) + "\n")

    print("\n".join(lineas))


if __name__ == "__main__":
    main()
