---
name: create-mapper
description: Crea mappers para convertir entre entity y schema de persistencia.
---

# Cuándo usar esta skill
Usar esta skill cuando:
- Existan conversiones entre capas.
- Se cree o modifique la persistencia del module.
- Se necesite transformar entity a schema de forma explícita.

# Cuándo no usar esta skill
No usar esta skill cuando:
- El module todavía no tiene entidad definida.
- No existen transformaciones entre capas.
- El cambio es puramente de rutas o validación superficial.

# Objetivo
Centralizar conversiones del module.

# Reglas
- `schema -> entity`
- `entity -> schema`
- Evitar lógica de negocio compleja en el mapper.
- No mapear `entity -> dto` en este mapper.
- La transformación `entity -> dto` debe implementarse en un presenter HTTP (ej: `infrastructure/http/presenters/<module>.presenter.ts`).
- Definir tipo de persistencia explícito `<Entity>Persistence` con `_id` opcional y auditoría camelCase.
- `toDomain` debe traducir `_id` a `id` string.

# Ejemplo mínimo
```ts
toDomain(doc: UserDocument): User
toPersistence(entity: User): UserPersistence
```

# Golden template (persistence mapper)
```ts
export interface UserPersistence {
  _id?: unknown;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
  createdBy?: string | null;
  updatedBy?: string | null;
}

toDomain(raw: UserPersistence): User {
  return new User({
    id: raw._id ? String(raw._id) : undefined,
    name: raw.name,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    deletedAt: raw.deletedAt ?? null,
    createdBy: raw.createdBy ?? null,
    updatedBy: raw.updatedBy ?? null,
  });
}
```
