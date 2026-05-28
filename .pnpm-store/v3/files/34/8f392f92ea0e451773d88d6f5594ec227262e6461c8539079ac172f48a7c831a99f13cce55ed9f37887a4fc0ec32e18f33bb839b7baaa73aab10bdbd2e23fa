---
name: create-pagination
description: Agrega paginación opcional a endpoints de listado cuando el usuario lo solicita explícitamente.
---

# Cuándo usar esta skill

Usar esta skill cuando:

- El usuario pida paginación para listados.
- El endpoint `GET` de listado deba responder `data + meta`.
- Se necesite aplicar `page` y `perPage` en query params.

# Cuándo no usar esta skill

No usar esta skill cuando:

- El usuario no haya pedido paginación.
- El listado deba mantenerse simple (array) por compatibilidad.

# Objetivo

Implementar paginación end-to-end en módulo existente:

- controller + DTO de query
- use-case
- contrato de repositorio
- implementación mongo repository
- presenter + DTO de respuesta paginada
- tests unitarios afectados

# Reglas

- Solo aplicar paginación si el usuario la pide explícitamente.
- Reutilizar utilidades de `src/share`:
  - `PaginationOptions`
  - `PaginationResult`
  - `findPaginatedResultRaw(...)` (en repositorio mongo)
- Mantener filtros existentes (ej: `name`) y combinarlos con paginación.
- En query DTO, agregar `page` y `perPage` con validación (`class-validator`) y transformación numérica (`class-transformer`).
- En controller de listado, responder DTO paginado (`data` + `meta`) y documentarlo en Swagger.
- Reutilizar `PaginationMetaDto` desde `@sdkconsultoria/nestjs-base/shared/infrastructure/http/dto/pagination-meta.dto`.
- En presenter, agregar mapper para respuesta paginada sin duplicar lógica de mapeo individual.
- Mantener naming en inglés.

# Checklist mínimo

- Query DTO actualizado con `page` y `perPage`.
- Use-case de listado devuelve `PaginationResult<Entity>`.
- Repositorio de dominio define método paginado.
- Repositorio mongo implementa método paginado con `findPaginatedResultRaw(...)`.
- Controller devuelve DTO paginado.
- `meta` del DTO paginado usa `PaginationMetaDto` del package.
- Presenter soporta mapeo paginado.
- Tests de use-case/controller/repository/presenter actualizados.

# Validación

- Ejecutar tests unitarios del módulo.
- Validar build TypeScript.
