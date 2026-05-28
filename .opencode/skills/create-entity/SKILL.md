---
name: create-entity
description: Crea la entidad de dominio del module sin dependencias de framework.
---

# Cuándo usar esta skill
Usar esta skill cuando:
- Se necesite definir una nueva entidad de dominio.
- Se esté creando un module nuevo.
- La estructura del dominio cambie de forma relevante.

# Cuándo no usar esta skill
No usar esta skill cuando:
- Solo se estén agregando DTOs.
- Solo se modifique persistencia.
- El cambio sea exclusivamente del controller o routing.

# Objetivo
Definir la entidad de dominio.

# Reglas
- La entidad no debe depender de NestJS ni de Mongoose.
- Debe representar reglas y estructura del dominio.
- Usar nombres consistentes con el module.
- Guardar la entidad directamente en `domain/<entity>.entity.ts` (sin carpeta `domain/entities`).
- Los nombres de entidad y atributos deben estar en inglés.
- Usar el patron de interfaces:
  - `<Entity>AuditFields` para auditoría.
  - `<Entity>Primitives` para atributos de la entidad (`extends <Entity>AuditFields`).
- La clase entidad debe:
  - Recibir `private readonly attributes: <Entity>Primitives` en el constructor.
  - Exponer getters por atributo.
  - Exponer `toPrimitives(): <Entity>Primitives` que devuelva una copia (`{ ...this.attributes }`).
