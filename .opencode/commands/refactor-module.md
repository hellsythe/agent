Refactoriza un módulo existente aplicando la skill `refactor-module` y todas las skills condicionales necesarias según el alcance.

Argumentos recibidos:
$ARGUMENTS

Tareas:

1. Interpretar el primer argumento como nombre del módulo objetivo.
2. Interpretar el resto como alcance o reglas del refactor (si vienen).
3. Usar la skill `refactor-module` como orquestadora principal.
4. Durante la ejecución, activar todas las skills condicionales que apliquen (no omitir por defecto `create-unit-tests` si hubo cambios de lógica).
5. Respetar `AGENTS.md`.
6. Mantener arquitectura hexagonal + NestJS + Mongoose.
7. Verificar nomenclatura en inglés en archivos/clases/DTOs/rutas/propiedades.
8. Ejecutar validación final:
   - `yarn build`
   - tests unitarios del módulo afectado
   - `yarn test:cucumber` si el refactor toca flujos E2E o el usuario lo solicita.
