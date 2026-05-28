Crea un módulo completo NestJS usando arquitectura hexagonal + Mongoose.

Argumentos recibidos: $ARGUMENTS

Tareas previas:
1. Interpretar el primer argumento como nombre del módulo (traducirlo a inglés si viene en español).
2. Interpretar el resto como lista de campos, por ejemplo: `name:string`, `email:string`, `age:number`.
3. Normalizar nombre del módulo y atributos a inglés antes de generar cualquier código.

---

# Proceso obligatorio (ejecutar en orden)

## 1. create-module — Estructura base
- Crear carpetas: `domain/`, `application/use-cases/`, `application/ports/`, `infrastructure/mappers/`, `infrastructure/persistence/mongo/`, `infrastructure/http/controllers/dto/`, `infrastructure/http/presenters/`, `infrastructure/http/adapters/`.
- Archivo principal `<module>.module.ts`.
- En `domain`, no crear subcarpetas `entities` ni `repositories`; usar archivos directos.
- Usar `infrastructure/persistence/mongo` (no `mongoose`).
- No crear `infrastructure/repositories` ni `infrastructure/client`.
- Definir `domain/<entity>.criteria.ts` y `infrastructure/persistence/mongo/<entity>.filter-map.ts`.
- Tipar filter-map con `CriteriaFilterMap` desde `@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/filter-operator`.

## 2. create-entity — Entidad de dominio
- Archivo `domain/<entity>.entity.ts` sin dependencias de NestJS ni Mongoose.
- Interfaces `<Entity>AuditFields` y `<Entity>Primitives extends <Entity>AuditFields`.
- Clase con constructor `private readonly attributes: <Entity>Primitives`, getters por atributo, y `toPrimitives()`.

## 3. add-audit-fields — Campos de auditoría
- Agregar en entity: `createdAt`, `updatedAt`, `deletedAt`, `createdBy`, `updatedBy`.
- En la entidad, campos de auditoría en `<Entity>AuditFields`.
- En schema Mongoose, usar `timestamps: true`.

## 4. create-repository — Repositorio
- Contrato en `domain/<entity>.repository.ts` con token `Symbol` (ej: `export const USER_REPOSITORY = Symbol('USER_REPOSITORY')`).
- Implementación en `infrastructure/persistence/mongo/<entity>.mongo.repository.ts` heredando `MongoRepositoryBase`.
- Importar `MongoRepositoryBase`, `MongoCriteriaBuilder` desde `@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/mongo/...`.
- Exponer `findByCriteria(criteria)` con `MongoCriteriaBuilder` + filter-map.
- Métodos mínimos CRUD: `save`, `findAll`, `findByCriteria`, `findById`, `update`/`updateById`, `delete` (soft delete).
- Usar `@Inject(REPOSITORY_TOKEN)` en casos de uso y `provide/useExisting` en el módulo.

## 5. create-mongoose-schema — Schema Mongoose
- Archivo `infrastructure/persistence/mongo/<entity>.schema.ts`.
- Reflejar campos del dominio + auditoría.
- `timestamps: true` con campos camelCase.
- No mezclar lógica de negocio.

## 6. create-mapper — Mapper de persistencia
- Definir `<Entity>Persistence` con `_id?: unknown` + campos + auditoría camelCase.
- Métodos `toDomain(raw): Entity` (traducir `_id` a `id` string) y `toPersistence(entity): <Entity>Persistence`.
- No mapear `entity -> DTO` aquí; eso va en el presenter HTTP.

## 7. create-use-cases — Casos de uso
- Un caso de uso por acción: `CreateXUseCase`, `GetXsUseCase`, `GetXByIdUseCase`, `UpdateXUseCase`, `DeleteXUseCase`.
- Cada uno expone un único método público `execute`.
- Escrituras reciben `Command` tipado; lecturas reciben `Query` tipada; definir en archivo dedicado.
- No acoplar a Mongoose ni al controller.
- No devolver DTOs HTTP desde `application`.
- No lanzar `HttpException` desde `application`.
- Usar `DomainError` / `ApplicationError` de `@sdkconsultoria/nestjs-base/shared/...`.
- Listado delega a `repository.findByCriteria(...)`.

## 8. create-controller — Controller y DTOs
- Controller en `infrastructure/http/controllers/<module>.controller.ts`.
- DTOs en `infrastructure/http/controllers/dto/`.
- Presenter en `infrastructure/http/presenters/<entity>.presenter.ts` para `entity -> response DTO`.
- Endpoints mínimos CRUD: `POST`, `GET`, `GET/:id`, `PATCH/:id`, `DELETE/:id`.
- Validación con `class-validator`; documentación con `@nestjs/swagger`.
- Query DTO dedicado `find-<module>-query.dto.ts` para filtros de listado.
- No usar el mapper de persistencia para respuestas HTTP.

## 9. create-external-adapters — Adapters externos (si aplica)
- Solo si el módulo consume APIs externas.
- Puerto en `application/ports/<capability>.port.ts` con token `Symbol`.
- Adapter en `infrastructure/http/adapters/<capability>/<capability>-http.adapter.ts`.
- Mappers auxiliares en `infrastructure/http/adapters/<capability>/mappers/`.
- No lógica de negocio en adapters; solo transporte y mapeo técnico.

## 10. create-application-services — Servicios de aplicación (si aplica)
- Solo si hay orquestación entre múltiples adapters externos.
- Servicio en `application/services/<capability>.service.ts`.
- Depende de puertos, no de adapters concretos.

## 11. create-unit-tests — Tests unitarios (siempre)
- Cubrir: use-cases, controller, presenter, mapper, mongo repository.
- Checklist: `create-<entity>.use-case.spec.ts`, `get-<module>.use-case.spec.ts`, `get-<entity>-by-id.use-case.spec.ts`, `update-<entity>.use-case.spec.ts`, `delete-<entity>.use-case.spec.ts`, `<module>.controller.spec.ts`, `<entity>.presenter.spec.ts`, `<entity>.mapper.spec.ts`, `<entity>.mongo.repository.spec.ts`.
- Jest, nombres en inglés, mocks/stubs (no BD real).

## 12. create-cucumber-e2e-tests — Tests E2E (si el usuario lo pide)
- Solo si el usuario pide pruebas E2E con Cucumber.
- Estructura: `test/cucumber/features/<module>.feature`, `steps/<module>.steps.ts`, `support/hooks.ts`.
- Asegurar scripts `test:cucumber` y `test:cucumber:full`.

## 13. create-pagination — Paginación (si el usuario lo pide)
- Solo si el usuario pide paginación explícitamente.
- Usar `PaginationOptions`, `PaginationResult`, `findPaginatedResultRaw(...)` de `src/share`.

## 14. create-errors — Errores personalizados (si el usuario lo pide)
- DomainError desde `@sdkconsultoria/nestjs-base/shared/domain/errors/domain-error`.
- ApplicationError desde `@sdkconsultoria/nestjs-base/shared/application/errors/application-error`.
- `type` RFC7807 estable por error.

---

# Validación final obligatoria
1. Revisar todos los archivos generados: identifiers, rutas, DTOs y propiedades deben estar en inglés.
2. Si detectas nombres en español, corregirlos antes de finalizar.
3. Validar que el repositorio concreto herede de `MongoRepositoryBase` y use `MongoCriteriaBuilder`.
4. Verificar que al menos use-cases y controller tengan tests unitarios.
5. Verificar imports y tokens de puertos (Symbol) sin strings en `@Inject(...)`.
6. No dar por terminado hasta que la validación pase.

# Árbol esperado final
```txt
<module>/
  <module>.module.ts
  domain/
    <entity>.entity.ts
    <entity>.criteria.ts
    <entity>.repository.ts
  application/
    use-cases/
      create-<entity>/
      get-<module>/
      get-<entity>-by-id/
      update-<entity>/
      delete-<entity>/
    ports/
  infrastructure/
    mappers/
    persistence/
      mongo/
        <entity>.schema.ts
        <entity>.filter-map.ts
        <entity>.mongo.repository.ts
    http/
      controllers/
        <module>.controller.ts
        dto/
          find-<module>-query.dto.ts
      presenters/
        <entity>.presenter.ts
      adapters/
        <capability>/
          <capability>-http.adapter.ts
          mappers/
```
