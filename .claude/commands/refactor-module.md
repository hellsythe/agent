Refactoriza un módulo existente aplicando todas las reglas del proyecto según el alcance del cambio.

Argumentos recibidos: $ARGUMENTS

Tareas previas:
1. Interpretar el primer argumento como nombre del módulo objetivo.
2. Interpretar el resto como alcance o reglas del refactor (si vienen).

---

# Proceso obligatorio

## 1. Identificar alcance por capa
Antes de tocar código, mapear qué capas están afectadas: domain, application, infrastructure, tests.

## 2. Matriz de activación — aplicar solo lo que corresponda

| Condición | Reglas a aplicar |
|-----------|-----------------|
| Cambia estructura base o naming del módulo | Ver reglas de `create-module` abajo |
| Cambia shape o invariantes de entidad | Ver reglas de `create-entity` abajo |
| Refactor requiere auditoría/soft-delete | Ver reglas de `add-audit-fields` abajo |
| Cambia contrato/repo de dominio o repo Mongo | Ver reglas de `create-repository` abajo |
| Cambia schema Mongo | Ver reglas de `create-mongoose-schema` abajo |
| Cambian conversiones entity/schema/DTO | Ver reglas de `create-mapper` abajo |
| Cambian casos de uso/queries/commands | Ver reglas de `create-use-cases` abajo |
| Cambian endpoints/DTOs/presenters | Ver reglas de `create-controller` abajo |
| Hay integración externa HTTP | Ver reglas de `create-external-adapters` abajo |
| Hay orquestación entre adapters | Ver reglas de `create-application-services` abajo |
| Se agregan errores semánticos | Ver reglas de `create-errors` abajo |
| El usuario pide paginación | Ver reglas de `create-pagination` abajo |
| Siempre que haya lógica afectada | Ver reglas de `create-unit-tests` abajo |
| El usuario pide E2E BDD | Ver reglas de `create-cucumber-e2e-tests` abajo |

## 3. Reglas por capa

### create-module — Estructura base
- No crear subcarpetas `entities` ni `repositories` en `domain`; usar archivos directos.
- Repositorio Mongo: `infrastructure/persistence/mongo/<entity>.mongo.repository.ts`.
- HTTP: `infrastructure/http/controllers/<module>.controller.ts`, `dto/`, `presenters/`.
- No crear `infrastructure/repositories` ni `infrastructure/client`.
- Criteria en `domain/<entity>.criteria.ts`; filter-map en `infrastructure/persistence/mongo/<entity>.filter-map.ts`.
- Tipar filter-map con `CriteriaFilterMap` desde `@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/filter-operator`.

### create-entity — Entidad de dominio
- Sin dependencias de NestJS ni Mongoose.
- Interfaces `<Entity>AuditFields` y `<Entity>Primitives extends <Entity>AuditFields`.
- Clase con constructor `private readonly attributes`, getters, `toPrimitives()`.

### add-audit-fields — Auditoría
- Campos: `createdAt`, `updatedAt`, `deletedAt`, `createdBy`, `updatedBy`.
- En entidad: dentro de `<Entity>AuditFields`.
- En schema: `timestamps: true`.

### create-repository — Repositorio
- Contrato en `domain/<entity>.repository.ts` con token `Symbol`.
- Implementación hereda `MongoRepositoryBase`, usa `MongoCriteriaBuilder`.
- Importar desde `@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/mongo/...`.
- Métodos mínimos: `save`, `findAll`, `findByCriteria`, `findById`, `update`/`updateById`, `delete`.
- `@Inject(REPOSITORY_TOKEN)` en casos de uso; `provide/useExisting` en módulo.

### create-mongoose-schema — Schema
- En `infrastructure/persistence/mongo/<entity>.schema.ts`.
- `timestamps: true`, campos camelCase, sin lógica de negocio.

### create-mapper — Mapper
- `<Entity>Persistence` con `_id?: unknown` + auditoría camelCase.
- `toDomain`: traduce `_id` a `id` string.
- `toPersistence`: entity → documento Mongo.
- No mapear `entity -> DTO` aquí; eso va en presenter HTTP.

### create-use-cases — Casos de uso
- Un `execute` público por caso de uso.
- Escrituras: `Command`; lecturas: `Query`; definidos en archivo dedicado.
- No acoplar a Mongoose/controller; no devolver DTOs HTTP; no lanzar `HttpException`.
- Errores: `DomainError` / `ApplicationError` de `@sdkconsultoria/nestjs-base/shared/...`.

### create-controller — Controller
- Controller delgado en `infrastructure/http/controllers/<module>.controller.ts`.
- DTOs en `dto/` con `class-validator` + `@nestjs/swagger`.
- Presenter en `infrastructure/http/presenters/<entity>.presenter.ts` para `entity -> response DTO`.
- No usar mapper de persistencia para respuestas HTTP.
- No usar DTOs Swagger dentro de `application`.

### create-external-adapters — Adapters externos
- Puerto en `application/ports/<capability>.port.ts` con token `Symbol`.
- Adapter en `infrastructure/http/adapters/<capability>/`.
- Sin lógica de negocio de dominio en adapters; solo transporte y mapeo técnico.
- Si hay orquestación entre adapters, moverla a `application/services`.
- No usar strings en `@Inject(...)`; usar tokens Symbol.

### create-application-services — Servicios de aplicación
- En `application/services/<capability>.service.ts`.
- Depende de puertos (`application/ports`), no de adapters concretos.
- Registrar en módulo; enlazar puerto -> adapter.

### create-errors — Errores personalizados
- `DomainError` desde `@sdkconsultoria/nestjs-base/shared/domain/errors/domain-error`.
- `ApplicationError` desde `@sdkconsultoria/nestjs-base/shared/application/errors/application-error`.
- `type` RFC7807 estable.

### create-pagination — Paginación
- Usar `PaginationOptions`, `PaginationResult`, `findPaginatedResultRaw(...)`.
- `PaginationMetaDto` desde `@sdkconsultoria/nestjs-base/shared/infrastructure/http/dto/pagination-meta.dto`.

### create-unit-tests — Tests unitarios
- Cubrir: use-cases, controller, presenter, mapper, mongo repository con mocks.
- Jest, nombres en inglés, sin BD real.

### create-cucumber-e2e-tests — Tests E2E
- Solo si el usuario lo solicita.
- Escenarios en inglés; reutilizar `test/testcontainers/test-infrastructure.ts`.
- Scripts `test:cucumber` y `test:cucumber:full`.

## 4. Reglas globales
- No usar `infrastructure/client`; usar `infrastructure/http/adapters/<capability>`.
- Si un adapter representa proveedor externo, usar puertos por proveedor y tokens consistentes.
- Los servicios de aplicación dependen de puertos, no de adapters concretos.
- Mantener nombres en inglés para archivos, clases, métodos, rutas y propiedades.
- No asumir que una sola sección cubre todo un refactor; aplicar todas las secciones impactadas.

---

# Validación obligatoria al finalizar
1. Verificar imports y tokens de puertos (Symbol) sin strings en `@Inject(...)`.
2. Verificar estructura por capas y ubicación de adapters/mappers.
3. Verificar que `CriteriaFilterMap` use `@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/filter-operator`.
4. Ejecutar `yarn build`.
5. Ejecutar tests unitarios del módulo refactorizado.
6. Si aplica, ejecutar `yarn test:cucumber`.
