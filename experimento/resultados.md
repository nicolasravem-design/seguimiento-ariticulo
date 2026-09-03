# Resultados del experimento

- Registros: 10000 (tasa de falla 4.36 %)
- Partición: Hold-out 70/30 estratificado + validación cruzada 5-fold sobre entrenamiento
- Mejor modelo por F1: **Random Forest**

| Modelo | Exactitud | Precisión | Sensibilidad | F1 | ROC-AUC | PR-AUC | F1 (CV 5-fold) |
|---|---|---|---|---|---|---|---|
| Regresión logística | 0.753 | 0.130 | 0.817 | 0.224 | 0.849 | 0.326 | 0.218 ± 0.016 |
| Random Forest | 0.971 | 0.772 | 0.466 | 0.581 | 0.960 | 0.694 | 0.581 ± 0.065 |
| Gradient Boosting | 0.971 | 0.797 | 0.450 | 0.576 | 0.935 | 0.724 | 0.611 ± 0.059 |

## Ajuste del umbral de decisión

Umbral seleccionado sobre predicciones out-of-fold: **0.33** (por defecto 0.5).

| Configuración | Precisión | Sensibilidad | F1 | Falsos negativos |
|---|---|---|---|---|
| Random Forest (umbral 0.5) | 0.772 | 0.466 | 0.581 | 70 |
| Random Forest (umbral 0.33) | 0.672 | 0.641 | 0.656 | 47 |

## Importancia por permutación (mejor modelo)

| Variable | Importancia |
|---|---|
| temp_proceso_K | 0.4012 |
| vel_rotacion_rpm | 0.3137 |
| temp_aire_K | 0.1817 |
| par_Nm | 0.1115 |
| desgaste_min | 0.0871 |
| calidad | 0.0060 |
