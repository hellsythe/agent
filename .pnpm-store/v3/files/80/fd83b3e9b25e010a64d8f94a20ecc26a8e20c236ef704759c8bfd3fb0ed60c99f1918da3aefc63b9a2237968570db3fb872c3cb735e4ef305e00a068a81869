---
name: create-errors
description: Crea errores personalizados de dominio y aplicación alineados a RFC7807.
---

# Cuándo usar esta skill

Usar esta skill cuando:

- El usuario pida errores personalizados de negocio.
- Un caso de uso requiera errores semánticos reutilizables.
- Se necesite tipificar errores por módulo.

# Cuándo no usar esta skill

No usar esta skill cuando:

- El error sea técnico/transitorio de infraestructura.
- Solo se necesite un mensaje local sin reutilización.

# Objetivo

Definir clases de error claras por capa:

- Dominio: invariantes de negocio.
- Aplicación: reglas de orquestación/contexto del caso de uso.

# Reglas

- Errores de dominio deben heredar de:
- `@sdkconsultoria/nestjs-base/shared/domain/errors/domain-error`
- Errores de aplicación deben heredar de:
- `@sdkconsultoria/nestjs-base/shared/application/errors/application-error`
- Mantener nombres en inglés y específicos (ej: `StudentEnrollmentAlreadyExistsError`).
- Evitar lanzar `HttpException` en capa dominio/aplicación para reglas de negocio.
- Mantener `type` RFC7807 estable por error (URI única por tipo).

# Estructura sugerida

```txt
<module>/
  domain/
    errors/
      <domain-rule>.error.ts
  application/
    errors/
      <application-rule>.error.ts
```

# Plantilla mínima

```ts
import { DomainError } from '@sdkconsultoria/nestjs-base/shared/domain/errors/domain-error';

export class StudentEnrollmentAlreadyExistsError extends DomainError {
  readonly type =
    'https://errors.sdkconsultoria.com/students/enrollment-already-exists';

  constructor(enrollment: string) {
    super(`Student with enrollment '${enrollment}' already exists`);
  }
}
```

```ts
import { ApplicationError } from '@sdkconsultoria/nestjs-base/shared/application/errors/application-error';

export class GradeUpdateRequiresActorError extends ApplicationError {
  readonly type =
    'https://errors.sdkconsultoria.com/students/grade-update-requires-actor';
  readonly title = 'Grade Update Requires Actor';
  readonly status = 422;

  constructor() {
    super('You cannot update a student grade without updatedBy actor');
  }
}
```
