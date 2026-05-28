Agrega campos de auditoría y soft delete al módulo indicado.

Módulo/contexto: $ARGUMENTS

# Cuándo usar esta skill
- El proyecto requiera auditoría estándar.
- Se esté creando una nueva entidad persistible.
- `scaffold-module` la invoque para alinear entity, schema y mapper.

# Cuándo no usar esta skill
- El recurso no debe tener auditoría por una excepción explícita del proyecto.
- Se trate de objetos efímeros o DTOs temporales sin persistencia.
- Solo se está haciendo un cambio de presentación.

# Objetivo
Agregar los campos estándar de auditoría.

# Campos de auditoría
- createdAt
- updatedAt
- deletedAt
- createdBy
- updatedBy

# Reglas
- Aplicar estos campos en entity, schema y mappers cuando corresponda.
- Mantener tipos consistentes.
- En la entidad, los campos de auditoría deben vivir en la interfaz `<Entity>AuditFields`.
- `<Entity>Primitives` debe extender `<Entity>AuditFields`.
- En schema Mongoose con nombres camelCase estándar, usar `timestamps: true`.

# Ejemplo mínimo
```ts
// entity
createdAt?: Date; updatedAt?: Date; deletedAt?: Date | null;
createdBy?: string | null; updatedBy?: string | null;

// schema (mongo)
timestamps: true
```
