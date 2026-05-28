Crea un módulo completo usando la skill `scaffold-module`.

Argumentos recibidos:
$ARGUMENTS

Tareas:
1. Interpretar el primer argumento como nombre del módulo.
2. Interpretar el resto como lista de campos, por ejemplo:
   - `name:string`
   - `email:string`
   - `work:string`
3. Usar la skill `scaffold-module`.
4. Respetar `AGENTS.md`.
5. Usar NestJS + Mongoose + arquitectura hexagonal.
6. Seguir las secciones de "Cuándo usar esta skill" y "Cuándo no usar esta skill" de cada skill involucrada.
7. Normalizar el nombre del módulo y los atributos a inglés antes de generar código.
8. Si el usuario pasa nombres en español, traducirlos a un equivalente natural en inglés y usar ese resultado en archivos, clases, rutas y propiedades.
9. Ejecutar validación final obligatoria de naming:
   - Revisar archivos generados y confirmar que identifiers/rutas/DTOs estén en inglés.
   - Si detectas nombres en español, corregirlos antes de finalizar.
   - No dar por terminado el comando hasta que la validación pase.
10. Invocar la skill `create-unit-tests` para cubrir por defecto los archivos generados relevantes.
11. Si el usuario pide pruebas E2E con Cucumber, invocar `create-cucumber-e2e-tests`.
12. Si se crean pruebas Cucumber, asegurar scripts `test:cucumber` (base) y `test:cucumber:full` (escenarios `@full` cuando aplique).
