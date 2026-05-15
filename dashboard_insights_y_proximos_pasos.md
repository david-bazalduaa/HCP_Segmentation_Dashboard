# Resumen de la Etapa: Dashboard de Segmentación HCP e Insights Comerciales

## 1. Lo que construimos (Etapa Descriptiva y Visual)
Durante esta fase logramos transformar los resultados de los modelos de Machine Learning y el procesamiento del dataset principal (`hcp_analysis_clean.parquet`, con sus 191 columnas) en un producto de Inteligencia de Negocios accionable. Los principales logros técnicos y de negocio fueron:

*   **Desarrollo del Dashboard Ejecutivo:** Construimos una interfaz interactiva utilizando HTML, CSS (basado en la guía de estilo de Pfizer) y Chart.js. Esto garantiza un acceso rápido, sin dependencias pesadas, ideal para tomadores de decisiones.
*   **Enfoque en Negocio (Reducción de Ruido):** Limpiamos el dashboard de métricas puramente técnicas para Data Scientists (como la pestaña de Population Stability Index / Drift). Nos centramos exclusivamente en KPIs comerciales: adopción de marca, distribución de segmentos, eficiencia de los representantes y competitividad.
*   **Detección de Oportunidades "Unlabeled":** Desarrollamos una vista específica (Scatter Plot) que nos permite identificar a HCPs de alto valor que actualmente tienen cero visitas por parte de los representantes. Esto dejó de ser un simple número para convertirse en perfiles concretos listos para el *outreach*.
*   **Análisis Longitudinal y de Embudos:** Implementamos gráficos que rastrean el viaje del médico desde "Never Tried" hasta prescriptor "Activo", analizando las diferencias de comportamiento entre los distintos segmentos (Tradicional, Relacional, Didáctico).

## 2. Principales Insights Comerciales
A partir del análisis plasmado en el dashboard, surgieron los siguientes insights clave que justifican la evolución del proyecto:

1.  **Heterogeneidad de los Segmentos:** No todos los médicos responden igual a los estímulos del marketing. Los perfiles Tradicionales, Relacionales y Didácticos muestran sensibilidades muy distintas en la relación *Details vs. Prescriptions (Rx)*.
2.  **Oportunidad Latente:** Existe un volumen considerable de HCPs con potencial alto de prescripción (UC TRx) que actualmente son puntos ciegos para la fuerza de ventas al no tener registro de visitas.
3.  **Relación No Lineal de las Visitas:** El aumento en la cantidad de detalles/visitas de un representante no siempre resulta en un aumento proporcional en las recetas. Existen puntos de rendimientos decrecientes y saturación que no pueden ser explicados con análisis tradicionales.

---

## 3. Próximos Pasos: Hacia el Modelado Predictivo y de Propensión

El dashboard nos ayudó a responder **qué** está sucediendo y **dónde** están las oportunidades. La siguiente evolución lógica del proyecto es responder **qué pasará** y **por qué**, mediante la creación de un modelo que genere probabilidades de éxito.

Para ello, la mejor estrategia técnica actual para manejar datos tabulares/propensión es la combinación de **XGBoost + SHAP**:

### A. XGBoost (o LightGBM) como Motor de Poder Predictivo
*   **El Reto:** Como vimos en los insights, la relación entre las visitas de los representantes y las recetas no es una línea recta. Depende de múltiples variables cruzadas (especialidad, adopción previa, tiempo desde la última visita).
*   **La Solución:** Un modelo basado en árboles con *Gradient Boosting* (como XGBoost) es excepcionalmente bueno para capturar estas **relaciones no lineales** de forma natural, sin requerir una transformación excesiva de los datos. Esto nos dará la precisión necesaria para calcular la *probabilidad real* de que un médico específico genere una receta si recibe una visita.

### B. SHAP (SHapley Additive exPlanations) como "La Caja de Cristal"
*   **El Reto:** A los equipos comerciales no les sirve de nada que una "caja negra" les diga que un HCP tiene un 85% de probabilidad de recetar. Si no entienden el por qué, no confiarán en la herramienta ni sabrán cómo enfocar su discurso de ventas.
*   **La Solución:** SHAP nos permite desglosar matemáticamente cada predicción individual de XGBoost. 
*   **El Resultado Comercial:** Podremos decirle al representante de ventas: *"El modelo le asigna un 85% de probabilidad a este médico. **Los motivos que empujan esta probabilidad hacia arriba son:** su alta adopción previa de medicamentos biológicos y su especialidad en gastroenterología. **Los motivos en contra son:** que su volumen total de pacientes es bajo."*

### Conclusión
Pasaremos de tener una herramienta que describe el mercado a tener una **herramienta de prescripción y recomendación**. Al acoplar XGBoost con SHAP, no solo ranquearemos a los HCPs por su probabilidad de conversión, sino que empoderaremos a los representantes comerciales con el contexto necesario para personalizar su acercamiento en cada visita.
