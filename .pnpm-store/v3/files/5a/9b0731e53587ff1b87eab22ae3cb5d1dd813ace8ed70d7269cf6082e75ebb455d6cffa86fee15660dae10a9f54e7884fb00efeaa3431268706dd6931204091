---
name: create-repository
description: Define el contrato del repositorio y la implementación concreta de persistencia.
---

# Cuándo usar esta skill

Usar esta skill cuando:

- Se necesite persistir una nueva entidad.
- Se cree un module nuevo con acceso a base de datos.
- Se requiera una abstracción de repositorio alineada con arquitectura limpia.

# Cuándo no usar esta skill

No usar esta skill cuando:

- El module no tiene persistencia.
- Solo se agrega lógica de aplicación sin tocar acceso a datos.
- El cambio es únicamente de controller o DTOs.

# Objetivo

Crear:

- interfaz de repositorio en dominio o aplicación
- implementación en infraestructura

# Reglas

- El repositorio debe devolver entidades.
- No devolver DTOs ni schemas.
- La implementación concreta usa mappers para traducir datos.
- La implementación concreta debe ubicarse en `infrastructure/persistence/mongo/<entity>.mongo.repository.ts`.
- No crear carpeta `infrastructure/repositories`.
- La implementación concreta debe heredar de `MongoRepositoryBase<SchemaClass, Persistence>`.
- Debe usar `findOneRaw`, `findManyRaw`, `insertRaw`, `updateByIdRaw`, `softDeleteRaw` de la base siempre que aplique.
- Debe exponer `findByCriteria(criteria)` y resolverlo con `MongoCriteriaBuilder` + `<entity>.filter-map.ts`.
- Las bases `MongoRepositoryBase` y `MongoCriteriaBuilder` deben importarse desde `@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/mongo/...`.
- El tipado de filtros (`CriteriaFilterMap`, `FieldFilterConfig`) debe importarse desde `@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/filter-operator`.
- Definir el contrato del repositorio directamente en `domain/<entity>.repository.ts` (sin carpeta `domain/repositories`).
- El nombre del repositorio, metodos y contratos debe estar en inglés.
- Definir token de inyección con `Symbol` en el archivo de contrato del repositorio, por ejemplo:
  - `export const USER_REPOSITORY = Symbol('USER_REPOSITORY');`
- El token debe inyectarse en casos de uso con `@Inject(USER_REPOSITORY)` y enlazarse en el module con `provide/useExisting`.
- En modules CRUD, el contrato debe incluir como mínimo:
  - `save(entity)`
  - `findAll()`
  - `findByCriteria(criteria)`
  - `findById(id)`
  - `update(entity)` o `updateById(id, partial)`
  - `delete(id)` (soft delete cuando aplique)
- Si el usuario pide paginación, agregar contrato paginado (ej: `findByCriteriaPaginated(criteria, options)`) y usar `findPaginatedResultRaw(...)` en la implementación.

# Ejemplo mínimo

```ts
// domain/user.repository.ts
export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
  save(user: User): Promise<User>;
  findAll(): Promise<User[]>;
}
```

# Golden template (mongo repository)

```ts
import { MongoCriteriaBuilder } from '@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/mongo/mongo-criteria.builder';
import { MongoRepositoryBase } from '@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/mongo/mongo.repository.base';
import type { CriteriaFilterMap } from '@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/filter-operator';

@Injectable()
export class MongoUserRepository
  extends MongoRepositoryBase<UserSchemaClass, UserPersistence>
  implements UserRepository
{
  constructor(
    @InjectModel(UserSchemaClass.name)
    userModel: Model<UserSchemaClass>,
    private readonly userMapper: UserMapper,
  ) {
    super(userModel);
  }

  async findByCriteria(criteria: UserCriteria): Promise<User[]> {
    const filter = MongoCriteriaBuilder.build<UserCriteria, UserPersistence>(
      criteria,
      USER_FILTER_MAP,
    );

    const raw = await this.findManyRaw(filter);
    return raw.map((item) => this.userMapper.toDomain(item));
  }
}
```
