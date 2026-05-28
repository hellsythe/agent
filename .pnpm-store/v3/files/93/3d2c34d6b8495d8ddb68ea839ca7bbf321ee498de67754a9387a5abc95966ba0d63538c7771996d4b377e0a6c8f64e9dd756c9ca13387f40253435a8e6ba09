---
name: refactor-module
description: Orquesta refactors de módulos existentes aplicando todas las skills necesarias según el alcance del cambio.
---

# Cuándo usar esta skill

Usar esta skill cuando:

- El usuario pida refactorizar un módulo existente.
- El cambio toque múltiples capas (application, infrastructure, persistence, http).
- Exista riesgo de dejar reglas del proyecto inconsistentes entre archivos.

# Cuándo no usar esta skill

No usar esta skill cuando:

- El cambio es puntual en un solo archivo.
- Solo se necesita corregir un bug menor sin impacto estructural.
- Se está creando un módulo nuevo desde cero (usar `scaffold-module`).

# Objetivo

Aplicar un refactor coherente y completo de un módulo existente, activando las skills correctas por condición para no dejar huecos.

# Proceso obligatorio

1. Identificar alcance del refactor por capa (domain, application, infrastructure, tests).
2. Mapear qué skills aplican y ejecutar todas las necesarias.
3. Refactorizar código y estructura siguiendo `AGENTS.md`.
4. Actualizar pruebas afectadas.
5. Ejecutar validación final (build + tests relevantes).

# Matriz de activación de skills

- Si se cambia estructura base de carpetas/naming del módulo: `create-module`.
- Si se cambia shape o invariantes de entidad: `create-entity`.
- Si el refactor requiere auditoría/soft-delete: `add-audit-fields`.
- Si se cambia contrato/repo de dominio o repo Mongo: `create-repository`.
- Si se cambia schema Mongo: `create-mongoose-schema`.
- Si se cambian conversiones entity/schema/DTO: `create-mapper`.
- Si se cambian casos de uso/queries/commands: `create-use-cases`.
- Si se cambian endpoints/DTOs/presenters: `create-controller`.
- Si hay integración externa HTTP: `create-external-adapters`.
- Si hay orquestación entre adapters: `create-application-services`.
- Si se agregan errores semánticos: `create-errors`.
- Si el usuario pide paginación: `create-pagination`.
- Siempre que haya lógica afectada: `create-unit-tests`.
- Si el usuario pide E2E BDD: `create-cucumber-e2e-tests`.

# Reglas

- No asumir que una sola skill cubre todo un refactor.
- Si una decisión mueve responsabilidades entre capas, aplicar todas las skills impactadas.
- No usar `infrastructure/client`; usar `infrastructure/http/adapters/<capability>`.
- Si un adapter representa proveedor externo, usar puertos por proveedor (`MsTemplatesPort`, `MsResourcesPort`) y tokens consistentes.
- Los servicios de aplicación dependen de puertos, no de adapters concretos.
- Mantener nombres en inglés para archivos, clases, métodos, rutas y propiedades.

# Validación obligatoria al finalizar

- Verificar imports y tokens de puertos (`Symbol`) sin strings en `@Inject(...)`.
- Verificar estructura por capas y ubicación de adapters/mappers.
- Verificar que `CriteriaFilterMap` use `@sdkconsultoria/nestjs-base/shared/infrastructure/persistence/filter-operator`.
- Ejecutar `yarn build`.
- Ejecutar tests unitarios del módulo refactorizado.
- Si aplica, ejecutar `yarn test:cucumber`.

# Resultado esperado

- Refactor completo, consistente y compilando.
- Sin deuda de estructura entre capas.
- Con pruebas actualizadas para los cambios reales.
