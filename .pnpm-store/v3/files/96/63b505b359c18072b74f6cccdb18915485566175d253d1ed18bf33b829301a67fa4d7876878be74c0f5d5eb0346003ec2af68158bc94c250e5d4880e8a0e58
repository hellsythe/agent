---
name: create-module
description: Crea la estructura base de carpetas y archivos iniciales de un module.
---

# Cuándo usar esta skill

Usar esta skill cuando:

- Se esté creando un module nuevo.
- `scaffold-module` la invoque como parte del flujo principal.
- Se necesite preparar la estructura base antes de crear archivos internos.

# Cuándo no usar esta skill

No usar esta skill cuando:

- El module ya existe y solo se agregarán archivos puntuales.
- Solo se va a modificar lógica dentro de una capa existente.
- El cambio es una corrección menor dentro de archivos ya creados.

# Objetivo

Crear el esqueleto del module respetando la arquitectura del proyecto.

# Salida esperada

- Carpetas de domain, application e infrastructure.
- En `domain`, no crear subcarpetas `entities` ni `repositories`; usar archivos directos.
- Usar nombres en inglés para módulos, archivos y carpetas.
- En persistencia Mongo, usar `infrastructure/persistence/mongo`.
- El repositorio Mongo debe seguir el patron `<entity>.mongo.repository.ts`.
- No crear `infrastructure/repositories`.
- En HTTP, usar estructura fija:
  - `infrastructure/http/controllers/<module>.controller.ts`
  - `infrastructure/http/controllers/dto/*.dto.ts`
  - `infrastructure/http/presenters/<entity>.presenter.ts`
- Si el módulo tiene filtros de listado, crear `infrastructure/http/controllers/dto/find-<module>-query.dto.ts`.
- Definir `domain/<entity>.criteria.ts` para filtros del módulo.
- Definir `infrastructure/persistence/mongo/<entity>.filter-map.ts` para mapear criteria a operadores.
- Tipar el filter-map con `CriteriaFilterMap` desde `@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/filter-operator`.
- Incluir `application/ports` para puertos de integraciones externas.
- Si el módulo consume APIs HTTP externas, preparar `infrastructure/http/adapters/<capability>` como estructura base.
- Si el adapter requiere mapeos o tipos auxiliares, preparar `infrastructure/http/adapters/<capability>/mappers`.
- No crear carpeta `infrastructure/client`; la implementación concreta de integraciones externas debe delegarse a `create-external-adapters`.
- Archivo principal del módulo NestJS.
- Base mínima para continuar con las demás skills.

# Plantilla de estructura

```txt
<module>/
  <module>.module.ts
  domain/
    <entity>.entity.ts
    <entity>.criteria.ts
    <entity>.repository.ts
  application/
    use-cases/
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
          mappers/
```
