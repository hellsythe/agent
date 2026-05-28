Crea adapters HTTP externos alineados a puertos de aplicación.

Módulo/contexto: $ARGUMENTS

# Cuándo usar esta skill
- El módulo consume APIs externas.
- Se implementa un puerto definido en `application/ports`.
- Se necesita organizar adapters por capacidad con archivos de soporte locales.

# Cuándo no usar esta skill
- El cambio es solo de controller/DTO local.
- No existe integración externa.
- El módulo no define puertos de aplicación para la integración.

# Objetivo
Estandarizar integraciones externas con una estructura clara de adapters por capacidad sin mezclar responsabilidades.

# Estructura esperada
```txt
<module>/
  application/
    ports/
      <capability>.port.ts
  infrastructure/
    http/
      adapters/
        <capability>/
          <capability>-http.adapter.ts
          mappers/
            *.mapper.ts
            types.ts
```

# Reglas
- Definir contrato en `application/ports/<capability>.port.ts`.
- Definir token de inyección con `Symbol` en el mismo archivo del puerto.
- Para integraciones con proveedores externos, nombrar puertos por proveedor (ej: `MsTemplatesPort`, `MsResourcesPort`).
- El token del puerto debe seguir el mismo criterio del proveedor (ej: `MS_TEMPLATES_PORT`, `MS_RESOURCES_PORT`).
- El adapter debe vivir en `infrastructure/http/adapters/<capability>` e implementar el puerto.
- Organizar por carpeta de capacidad (ej: `campaign-dispatcher`, `message-delivery-monitor`, `templates-query`).
- Si el adapter requiere mapeos o tipos auxiliares, ubicarlos en `infrastructure/http/adapters/<capability>/mappers`.
- No crear carpeta `infrastructure/client`; todo consumo externo se modela como adapter.
- El adapter no debe contener lógica de negocio de dominio; solo traducción, transporte y mapeo técnico.
- Si aparece orquestación entre múltiples adapters, moverla a `application/services` usando `create-application-services`.
- El adapter sí puede traducir errores técnicos a errores de aplicación/dominio.
- No usar strings en `@Inject(...)`; usar tokens `Symbol`.
- No usar DTOs Swagger en `application` ni en `domain`.
- Mantener nombres en inglés para archivos, clases, métodos y propiedades.

# Naming recomendado
- Puerto: `<Capability>Port` (capacidad interna) o `<Provider>Port` (proveedor externo)
- Token: `<CAPABILITY>_PORT` o `<PROVIDER>_PORT` (Symbol)
- Adapter: `<Capability>HttpAdapter`
- Carpeta: `<capability>/`
- Mapper auxiliar: `mappers/<name>.mapper.ts`

# Manejo de errores
- Traducir errores de proveedor a `ApplicationError` o `DomainError` según corresponda.
- No lanzar `HttpException` desde `application` para reglas de negocio.
- Conservar mensajes útiles y estables para debugging.

# Checklist mínimo
- Puerto + token `Symbol` en `application/ports`.
- Adapter implementando el puerto.
- Provider del módulo enlazando token -> adapter (`provide/useClass`).
- Tests unitarios de adapter (happy path + errores).
- Si hay mappers auxiliares, tests unitarios de mapper.

# Ejemplo mínimo
```ts
// application/ports/template-query.port.ts
export const TEMPLATE_QUERY = Symbol('TEMPLATE_QUERY');

export interface TemplateQuery {
  findById(id: string): Promise<{ id: string; name: string }>;
}
```

```ts
// infrastructure/http/adapters/template-query/template-query-http.adapter.ts
export class TemplateQueryHttpAdapter implements TemplateQuery {
  constructor(private readonly http: HttpService) {}

  async findById(id: string): Promise<{ id: string; name: string }> {
    const response = await this.http.get(`/templates/${id}`);
    return { id: response.id, name: response.name };
  }
}
```
