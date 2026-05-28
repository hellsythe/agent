---
name: create-controller
description: Crea el controller, DTOs y endpoints base del module.
---

# Cuándo usar esta skill
Usar esta skill cuando:
- El module necesita exponer endpoints HTTP.
- Se está creando la capa de presentación del module.
- `scaffold-module` la invoque como parte del flujo completo.

# Cuándo no usar esta skill
No usar esta skill cuando:
- El module no expone API HTTP.
- Solo se trabaja en dominio o persistencia.
- El cambio es exclusivo de base de datos o mappers.

# Objetivo
Exponer endpoints del module.

# Reglas
- Mantener el controller delgado.
- El controller debe vivir en `infrastructure/http/controllers/<module>.controller.ts`.
- Validar entrada con DTOs usando `class-validator`.
- Documentar endpoints y DTOs con `@nestjs/swagger`.
- Definir rutas, handlers, DTOs y propiedades en inglés.
- En DTOs de request, usar decoradores de validación (`IsString`, `IsInt`, `IsOptional`, etc.) y `ApiProperty`/`ApiPropertyOptional`.
- Todos los DTOs HTTP (request/response) deben vivir en `infrastructure/http/controllers/dto`.
- Los DTOs de response HTTP deben vivir en `infrastructure/http/controllers/dto`.
- Delegar comportamiento a casos de uso.
- Mantener nombres de rutas y handlers consistentes.
- Mapear `entity -> response dto` mediante presenter (ej: `infrastructure/http/presenters/<module>.presenter.ts`).
- No usar el mapper de persistencia para transformar respuestas HTTP.
- No usar DTOs con decorators de Swagger dentro de `application`.
- En modules CRUD, exponer como mínimo endpoints:
  - `POST /<module>`
  - `GET /<module>`
  - `GET /<module>/:id`
  - `PATCH /<module>/:id`
  - `DELETE /<module>/:id`
- En `GET /<module>`, exponer filtros opcionales vía query params tipados (ej: `name`).
- Documentar filtros en el Query DTO con `@ApiPropertyOptional` y mapearlos a `Get<Module>Query`.
- Cuando haya uno o más filtros, usar un Query DTO dedicado (ej: `find-<module>-query.dto.ts`) con `@Query()` en el controller.
- Si el endpoint de listado es paginado, usar DTO de respuesta paginada con `meta` tipado por `PaginationMetaDto` importado desde `@sdkconsultoria/nestjs-base/shared/infrastructure/http/dto/pagination-meta.dto`.
- Evitar múltiples parámetros inline tipo `@Query('x') x?: ...` para mantener firmas limpias.

# Ejemplo mínimo
```ts
class CreateUserDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() lastname: string;
  @ApiProperty() @IsInt() age: number;
}

@Post()
async create(@Body() dto: CreateUserDto) { return this.createUserUseCase.execute(dto); }
```

# Golden template (list endpoint with filters)
```ts
@Get()
@ApiOkResponse({ type: UserResponseDto, isArray: true })
async findAll(@Query() query: FindUsersQueryDto): Promise<UserResponseDto[]> {
  const users = await this.getUsersUseCase.execute(
    new GetUsersQuery(query.name),
  );
  return users.map((user) => this.userPresenter.toResponse(user));
}
```
