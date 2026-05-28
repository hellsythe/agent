# CLAUDE.md

Este proyecto usa NestJS + TypeScript + MongoDB (Mongoose) con arquitectura hexagonal. Leer `AGENTS.md` para reglas globales de estructura.

## Comandos disponibles

Los comandos del proyecto viven en `.claude/commands/`. Cada uno contiene las reglas detalladas para su tarea. Aplicar el comando correcto según el contexto — no hace falta que el usuario los invoque explícitamente.

## Cuándo aplicar cada comando automáticamente

### `/module` — Scaffolding completo
Aplicar cuando el usuario pida:
- "crea un módulo de X"
- "genera el módulo X con campos Y, Z"
- "necesito un CRUD de X"
- Cualquier creación de recurso completo desde cero

### `/refactor-module` — Refactor de módulo existente
Aplicar cuando el usuario pida:
- "refactoriza el módulo X"
- "actualiza la estructura de X"
- "arregla la arquitectura de X"
- Cambios que tocan múltiples capas de un módulo existente

### `/create-entity` — Solo entidad de dominio
Aplicar cuando el usuario pida:
- "crea/modifica la entidad X"
- "agrega el campo Y a la entidad X"
- Cambios en la estructura del dominio sin tocar otras capas

### `/add-audit-fields` — Campos de auditoría
Aplicar cuando el usuario pida:
- "agrega auditoría al módulo X"
- "necesito createdAt/updatedAt en X"
- "agrega soft delete a X"

### `/create-repository` — Repositorio
Aplicar cuando el usuario pida:
- "crea el repositorio de X"
- "agrega el método Y al repositorio X"
- Cambios en contrato de repositorio o implementación Mongo

### `/create-mongoose-schema` — Schema Mongoose
Aplicar cuando el usuario pida:
- "crea/modifica el schema de X"
- "agrega el campo Y al schema"
- Cambios exclusivos de persistencia Mongo

### `/create-mapper` — Mapper de persistencia
Aplicar cuando el usuario pida:
- "crea el mapper de X"
- "actualiza el mapper de X"
- Cambios en conversiones entity ↔ schema

### `/create-use-cases` — Casos de uso
Aplicar cuando el usuario pida:
- "crea el caso de uso X"
- "agrega la acción Y al módulo X"
- Nuevos flujos de negocio en la capa de aplicación

### `/create-controller` — Controller y DTOs
Aplicar cuando el usuario pida:
- "crea/modifica el controller de X"
- "agrega el endpoint Y"
- "crea el DTO de X"
- Cambios en la capa HTTP de presentación

### `/create-external-adapters` — Adapters HTTP externos
Aplicar cuando el usuario pida:
- "integra la API de X"
- "crea el adapter para el servicio Y"
- El módulo necesita consumir APIs externas

### `/create-application-services` — Servicios de aplicación
Aplicar cuando el usuario pida:
- "hay orquestación entre adapters X e Y"
- "mueve la lógica del adapter al servicio de aplicación"
- Cuando un adapter tiene lógica de negocio que debe moverse a `application/services`

### `/create-errors` — Errores personalizados
Aplicar cuando el usuario pida:
- "crea el error X"
- "agrega errores de dominio/aplicación"
- Se necesiten errores semánticos reutilizables

### `/create-pagination` — Paginación
Aplicar cuando el usuario pida:
- "agrega paginación al listado de X"
- "el endpoint GET debe paginar"
- **No aplicar si el usuario no lo pide explícitamente**

### `/create-unit-tests` — Tests unitarios
Aplicar cuando el usuario pida:
- "crea los tests de X"
- "agrega unit tests al módulo X"
- También aplicar automáticamente al generar o modificar use-cases, controllers, mappers o presenters

### `/create-cucumber-e2e-tests` — Tests E2E
Aplicar cuando el usuario pida:
- "crea pruebas E2E para X"
- "genera los escenarios Cucumber de X"
- **No aplicar si el usuario no lo pide explícitamente**

## Reglas de comportamiento

- Antes de generar código, identificar qué comandos aplican y seguir sus reglas.
- Si la tarea toca múltiples capas, aplicar todos los comandos relevantes en orden.
- Nunca inventar estructuras alternativas a las definidas en los comandos.
- Siempre validar naming en inglés antes de dar por terminada cualquier tarea.
- Al modificar lógica existente, aplicar `/create-unit-tests` automáticamente.
- No agregar paginación ni E2E sin que el usuario lo pida.
