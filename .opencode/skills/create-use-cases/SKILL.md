---
name: create-use-cases
description: Crea los casos de uso base del module en la capa de aplicación.
---

# Cuándo usar esta skill

Usar esta skill cuando:

- Se cree un module nuevo.
- Se necesiten acciones de aplicación como crear, actualizar, consultar o eliminar.
- Se requiera encapsular lógica de negocio en la capa de aplicación.

# Cuándo no usar esta skill

No usar esta skill cuando:

- Solo se quiere crear estructura de carpetas.
- El cambio es exclusivamente de persistencia o schema.
- Solo se modifica un DTO o una ruta sin impacto de negocio.

# Objetivo

Agregar casos de uso claros y específicos.

# Reglas

- Un caso de uso por acción relevante.
- Inyectar dependencias mediante abstracciones.
- Cada caso de uso debe exponer un único método público `execute`.
- En acciones de escritura (create/update/delete), `execute` debe recibir un `Command` tipado (ej: `CreateXCommand`).
- En acciones de lectura (get/list/search), `execute` debe recibir una `Query` tipada (ej: `GetXQuery`).
- Definir `Command` o `Query` en un archivo dedicado dentro del mismo caso de uso.
- Los puertos de integraciones externas se definen en `application/ports`.
- No acoplar los casos de uso a Mongoose ni al controller.
- Los casos de uso deben devolver entidades de dominio u output models de aplicación sin decoradores de framework.
- No devolver DTOs HTTP (Swagger) desde la capa `application`.
- Evitar lanzar `HttpException` de NestJS desde `application` para reglas de negocio.
- Para errores de dominio, usar clases que hereden de `DomainError` desde `@sdkconsultoria/nestjs-base/shared/domain/errors/domain-error`.
- Para errores de aplicación, usar clases que hereden de `ApplicationError` desde `@sdkconsultoria/nestjs-base/shared/application/errors/application-error`.
- Los nombres de casos de uso, commands, queries y propiedades deben estar en inglés.
- En modules CRUD, generar como mínimo estos casos de uso:
  - `CreateXUseCase`
  - `GetXsUseCase` (listado)
  - `GetXByIdUseCase`
  - `UpdateXUseCase`
  - `DeleteXUseCase` (soft delete si aplica)
- Para escritura usar `Command` dedicado (`CreateXCommand`, `UpdateXCommand`, `DeleteXCommand`).
- Para lectura usar `Query` dedicada (`GetXsQuery`, `GetXByIdQuery`).
- En el caso de uso de listado (`GetXsUseCase`), delegar siempre a `repository.findByCriteria(...)`.
- Definir `GetXsQuery` con filtros opcionales (ej: `name?: string`) en vez de branching `findAll` vs `findByCriteria`.
- `GetXsQuery` debe mapearse desde un Query DTO HTTP dedicado (`Find<Module>QueryDto`).

# Ejemplo mínimo

```ts
// create-user.use-case.ts
async execute(command: CreateUserCommand): Promise<UserSnapshot> { /* ... */ }

// get-users.use-case.ts
async execute(query: GetUsersQuery): Promise<UserSnapshot[]> { /* ... */ }
```

# Golden template (list use case)

```ts
@Injectable()
export class GetUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(query: GetUsersQuery): Promise<User[]> {
    return this.userRepository.findByCriteria({ name: query.name });
  }
}
```
