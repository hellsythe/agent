---
name: create-mongoose-schema
description: Crea el schema de Mongoose del module y su configuración de persistencia.
---

# Cuándo usar esta skill
Usar esta skill cuando:
- El module persiste datos en MongoDB mediante Mongoose.
- Se crea un nuevo recurso persistente.
- Cambia la estructura de persistencia del module.

# Cuándo no usar esta skill
No usar esta skill cuando:
- El module no usa MongoDB.
- Solo se trabaja en dominio puro sin persistencia.
- El cambio es solo en casos de uso o controller.

# Objetivo
Definir el schema de persistencia del module.

# Reglas
- Reflejar campos del dominio y auditoría.
- No mezclar lógica de negocio en el schema.
- Mantener naming consistente con la colección y el module.
- Ubicar el schema en `infrastructure/persistence/mongo/<entity>.schema.ts`.
- Usar carpeta `mongo` (no `mongoose`).
- Usar `timestamps: true` cuando la auditoría está en camelCase estándar.
- Campos de auditoría esperados en schema: `createdAt`, `updatedAt`, `deletedAt`, `createdBy`, `updatedBy`.
