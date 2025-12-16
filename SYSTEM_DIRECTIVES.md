# SYSTEM_DIRECTIVES.md

## Directivas Fundamentales del Sistema Lagrange

### 1. Corpus y Preguntas Socráticas
- El corpus crítico y las preguntas socráticas deben estar versionados, en formatos legibles por humanos (.me/.md) y por máquina (JSON).
- Todo contenido debe ser reutilizable, no moralizante y exponer contradicciones estructurales.
- El corpus y las preguntas no se editan en producción; toda modificación pasa por control de versiones.

### 2. Estructura de Episodios
- Los episodios se definen en un archivo JSON, cada uno vinculado a una pregunta, eje, ángulo y script markdown.
- Los scripts de episodios siguen una estructura fija y reutilizable, con metadatos claros y referencias a preguntas/ejes.
- Los episodios y scripts deben ser fácilmente consumibles por humanos y máquinas.

### 3. Automatización y Producción
- El build y deploy están automatizados y son multiplataforma (cross-env, scripts bash/node).
- El contenido se sincroniza automáticamente y nunca se edita directamente en producción.
- El sistema debe ser reproducible: cualquier persona puede reconstruir el estado desde cero usando los scripts y archivos versionados.

### 4. Reglas Editoriales y de Desarrollo
- Separar estrictamente contenido, estructura y automatización.
- Toda nueva funcionalidad, episodio o pregunta debe alinearse con estas directivas.
- Las reglas aquí descritas son de cumplimiento obligatorio para desarrolladores y editores.

### 5. Evolución y Futuro
- Las directivas pueden evolucionar, pero solo mediante consenso y versionado explícito.
- Las futuras integraciones (admin panel, IA, visualizaciones) deben respetar estas bases.

---

Este archivo es la referencia central para todo el equipo. Cualquier cambio debe ser discutido y versionado.