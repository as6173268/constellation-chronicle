<!--
Este archivo documenta cómo debe integrarse el mapa conceptual en el frontend.
Debe mantenerse actualizado si cambian lagrange_map.json o lagrange_map.svg.
-->

# Esquema de integración del Mapa Lagrange

## Carga del mapa
- El frontend debe cargar `lagrange_map.json` para obtener la estructura de ejes, preguntas y relaciones.
- El SVG `lagrange_map.svg` se carga como componente visual base.
- IDs y data-attributes en el SVG permiten mapear nodos y relaciones a los datos JSON.

## Resaltado de relaciones
- Al interactuar con un nodo de pregunta (por hover/click), se resaltan:
  - El nodo seleccionado
  - Todas las líneas de relación donde el nodo es origen o destino
  - Los nodos destino/origen conectados
- El tipo de relación (refuerza, contradice, desplaza) se representa por color, trazo o etiqueta visible.

## Navegación no lineal
- El usuario puede navegar entre preguntas, ejes y relaciones sin un flujo predefinido.
- No hay centro ni jerarquía: cualquier nodo puede ser punto de partida.
- La navegación debe permitir perderse, es decir, no hay breadcrumbs ni rutas forzadas.
- El frontend debe exponer la estructura y tensiones, no orientar ni simplificar.

---

Este esquema garantiza que el mapa sea interactivo, semántico y fiel a las reglas conceptuales del sistema.