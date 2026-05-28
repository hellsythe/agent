---
name: create-cucumber-e2e-tests
description: Crea pruebas end-to-end con Cucumber para validar flujos HTTP completos usando Testcontainers.
---

# Cuándo usar esta skill

Usar esta skill cuando:

- El usuario pida pruebas E2E con Cucumber.
- Se requiera validar flujos funcionales completos (API + persistencia + integraciones).
- Se necesiten escenarios BDD legibles por negocio.

# Cuándo no usar esta skill

No usar esta skill cuando:

- Solo se requieran pruebas unitarias o de integración simple.
- El cambio sea trivial y no amerite escenarios E2E.
- No existan endpoints o flujos de negocio que validar de extremo a extremo.

# Objetivo

Generar una suite E2E con Cucumber que pruebe el módulo de forma realista y mantenible.

# Reglas

- Usar Cucumber con archivos `*.feature` y step definitions en TypeScript.
- Mantener nombres y escenarios en inglés.
- Los escenarios deben cubrir happy path y errores relevantes.
- Evitar pasos ambiguos o demasiado genéricos.
- Reutilizar `test/testcontainers/test-infrastructure.ts` para arrancar contenedores.
- El helper `test/testcontainers/test-infrastructure.ts` debe importar infraestructura base desde `src/share`.
- Para escenarios E2E del módulo (CRUD API), usar `startMongoTestInfrastructure()`.
- Para escenarios de integración completa, usar `startFullTestInfrastructure()` y etiquetar escenarios con `@full`.
- Los steps no deben duplicar lógica de negocio; deben ejercer la API HTTP.
- Usar `supertest` (o cliente HTTP equivalente del proyecto) para invocar endpoints.
- Limpiar estado entre escenarios.
- No usar `TESTCONTAINERS_PROFILE` en steps; seleccionar perfil desde hooks/scripts.

# Estructura sugerida

```txt
test/
  cucumber/
    features/
      <module>.feature
    steps/
      <module>.steps.ts
    support/
      hooks.ts
      world.ts
```

# Checklist mínimo

- Archivo feature con escenarios de:
  - create
  - list/filter
  - get by id
  - update
  - delete
- Hooks de arranque y cierre de infraestructura.
- Steps desacoplados y reutilizables.
- Script npm para ejecutar la suite cucumber estándar (`test:cucumber`).
- Script npm para ejecutar escenarios `@full` (`test:cucumber:full`) cuando aplique.

# Validación

- Ejecutar la suite cucumber del módulo.
- Si no se puede ejecutar, reportar bloqueo exacto (dependencias, Docker, configuración).
