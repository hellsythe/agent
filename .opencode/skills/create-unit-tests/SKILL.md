---
name: create-unit-tests
description: Crea tests unitarios para los archivos generados del módulo, según su tipo y complejidad.
---

# Cuándo usar esta skill
Usar esta skill cuando:
- Se genere un módulo nuevo (por defecto).
- El usuario pida explícitamente tests unitarios.
- Se genere un módulo nuevo y se requiera cobertura base.
- Se modifiquen casos de uso, repositorios, mappers o presenters con lógica relevante.

# Cuándo no usar esta skill
No usar esta skill cuando:
- Solo se cambien archivos triviales sin lógica (constantes simples, barrels).
- El usuario pida una iteración rápida sin tests.

# Objetivo
Agregar tests unitarios útiles y mantenibles para el código generado, priorizando lógica de negocio y contratos críticos.

# Reglas
- Usar Jest y convenciones del proyecto (`*.spec.ts`).
- Nombres en inglés para describe/it/variables de test.
- Probar comportamiento observable, no detalles internos irrelevantes.
- Mantener aislamiento con mocks/stubs (no integrar BD real en unit tests).
- Para archivos generados en un módulo nuevo, cubrir como mínimo:
  - `application/use-cases/*`: casos exitosos y errores esperados.
  - `infrastructure/http/controllers/*`: mapeo DTO -> command/query y respuesta.
  - `infrastructure/http/presenters/*`: mapeo entity -> response DTO.
  - `infrastructure/mappers/*`: `toDomain` y `toPersistence`.
  - `infrastructure/persistence/mongo/*.mongo.repository.ts`: tests unitarios con model mockeado para métodos principales.
- DTOs de request se prueban solo si tienen validaciones no triviales.
- Si un archivo no requiere test por ser trivial, documentar brevemente la razón en la respuesta final.

# Checklist mínimo por módulo CRUD
- `create-<entity>.use-case.spec.ts`
- `get-<module>.use-case.spec.ts`
- `get-<entity>-by-id.use-case.spec.ts`
- `update-<entity>.use-case.spec.ts`
- `delete-<entity>.use-case.spec.ts`
- `<module>.controller.spec.ts`
- `<entity>.presenter.spec.ts`
- `<entity>.mapper.spec.ts`
- `<entity>.mongo.repository.spec.ts`

# Policy de cumplimiento
- La skill debe considerarse incompleta si falta cualquier archivo del checklist mínimo aplicable.
- Si algún spec no puede generarse de forma razonable, documentar explícitamente el motivo y marcarlo como excepción.
- No cerrar la tarea hasta que exista cobertura base de casos de uso y controller.

# Validación
- Ejecutar tests del módulo afectado.
- Si no es posible ejecutar tests, reportar exactamente qué faltó para correrlos.
