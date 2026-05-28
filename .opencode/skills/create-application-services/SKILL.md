---
name: create-application-services
description: Crea servicios de aplicación para orquestar adapters y reglas de integración usando puertos de aplicación.
---

# Cuándo usar esta skill

Usar esta skill cuando:

- Exista lógica de orquestación entre dos o más adapters externos.
- La clase actual llamada `*Adapter` realmente contenga reglas de aplicación.
- Se necesite mover decisiones de negocio/integración fuera de infraestructura.

# Cuándo no usar esta skill

No usar esta skill cuando:

- La clase solo traduce transporte HTTP y mapping técnico.
- El flujo es un adapter simple 1:1 sin reglas adicionales.

# Objetivo

Ubicar la orquestación y decisiones de aplicación en `application/services`, dejando adapters externos como componentes técnicos.

# Estructura esperada

```txt
<module>/
  application/
    services/
      <capability>.service.ts
      <capability>.service.spec.ts
  infrastructure/
    http/
      adapters/
        <provider>/
          <provider>-http.adapter.ts
```

# Reglas

- Los servicios de aplicación viven en `application/services`.
- Un servicio de aplicación debe depender de puertos (`application/ports`) y no de adapters concretos de infraestructura.
- Cada adapter externo involucrado debe implementar su puerto y registrarse en el módulo con `provide/useExisting` o `provide/useClass`.
- Si el adapter representa un proveedor externo, preferir puertos por proveedor (`MsTemplatesPort`, `MsResourcesPort`) en lugar de nombres ambiguos.
- La lógica de autorización, composición o validación entre respuestas externas pertenece al servicio de aplicación.
- Los adapters deben quedar enfocados en transporte HTTP, headers, URL, retries y mapping técnico.
- Errores de negocio/integración semántica deben traducirse a `ApplicationError` o `DomainError`.
- Mantener nombres en inglés para clases, métodos, archivos y propiedades.

# Checklist mínimo

- Servicio creado en `application/services`.
- Puertos de consulta/comando creados o reutilizados en `application/ports`.
- Casos de uso actualizados para depender del servicio.
- Provider del módulo registra el servicio.
- Provider del módulo enlaza puerto -> adapter para cada dependencia externa.
- Adapter mal clasificado movido o eliminado.
- Tests unitarios del servicio (happy path + errores).

# Ejemplo mínimo

```ts
// application/services/waba-authorization.service.ts
export class WabaAuthorizationService {
  constructor(
    @Inject(MS_TEMPLATES_PORT)
    private readonly msTemplatesPort: MsTemplatesPort,
    @Inject(MS_RESOURCES_PORT)
    private readonly msResourcesPort: MsResourcesPort,
  ) {}

  async authorize(templateId: string, accountId: string): Promise<void> {
    const template =
      await this.msTemplatesPort.getTemplateByComplexId(templateId);
    const wabas = await this.msResourcesPort.getWabasFromAccount(accountId);

    const isAuthorized = wabas.some((waba) => waba.id === template.waba);
    if (!isAuthorized) {
      throw new WabaNotAuthorizedError(
        `Account ${accountId} is not authorized for waba ${template.waba}`,
      );
    }
  }
}
```
