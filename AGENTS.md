# AGENTS.md

## Contexto del proyecto
Este proyecto usa NestJS, TypeScript y MongoDB con Mongoose.
La arquitectura base es hexagonal / limpia.

## Reglas globales
- Respetar el scaffolding y nombres definidos por el proyecto.
- El dominio no depende de framework.
- El repositorio de dominio siempre devuelve entidades, nunca DTOs ni schemas.
- Los mappers convierten entre entity, schema y DTO.
- Toda integración externa se modela con puerto + adapter.
- El puerto de integración externa va en `application/ports` (ej: `meta.port.ts`).
- El adapter concreto va en infraestructura según protocolo:
  - HTTP: `infrastructure/http/adapters` (ej: `meta.adapter.ts`).
- Usar soft delete cuando el module lo requiera.
- Incluir campos de auditoría cuando aplique:
  - `createdAt`
  - `updatedAt`
  - `deletedAt`
  - `createdBy`
  - `updatedBy`

## Convención sugerida por module
- `domain/<entity>.entity.ts`
- `domain/<entity>.criteria.ts`
- `domain/<entity>.repository.ts`
- `application/use-cases`
- `application/ports`
- `infrastructure/mappers`
- `infrastructure/persistence/mongo/<entity>.schema.ts`
- `infrastructure/persistence/mongo/<entity>.filter-map.ts`
- `infrastructure/persistence/mongo/<entity>.mongo.repository.ts`
- `infrastructure/http/controllers`
- `infrastructure/http/controllers/dto`
- `infrastructure/http/presenters`
- `infrastructure/http/adapters`

## Reglas de generación
- No inventar estructuras alternativas.
- No mezclar responsabilidad de capas.
- Mantener consistencia entre singular/plural en nombres.
- Preferir casos de uso específicos antes que servicios genéricos inflados.
