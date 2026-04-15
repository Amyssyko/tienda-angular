# Tienda Angular

Este repositorio se ha migrado a Angular 21.0.1.

Nota: originalmente el proyecto se generó con Angular CLI v15.2.10; durante la migración se actualizaron dependencias y configuración para Angular 21.

## Development server

Usa el script de desarrollo habitual:

```pwsh
bun run start
```

El servidor se iniciará en `http://localhost:4200/` (o en otro puerto si 4200 está en uso). Si ves un mensaje acerca de la versión de Node.js, considera usar una versión LTS (por ejemplo 18.x o 20.x) en vez de una versión impar no-LTS.

## Seguridad de supply chain con Bun

Se añadieron controles de seguridad para Bun y dependencias fijadas:

- `packageManager` fijado a versión exacta de Bun en `package.json`.
- lockfile de Bun (`bun.lock`) como fuente reproducible de instalación.
- validación de versiones exactas y bloqueo de fuentes/rangos inseguros en dependencias.

Además, este repo incorpora un baseline de seguridad automatizado en `scripts/security/`:

- Hardening de configuración (`security:check-config`): valida `packageManager`, lockfile de Bun y scripts mínimos.
- Auditoría de vulnerabilidades (`bun audit` + `npm audit`) con política y grace temporal (`security:enforce-audit`).
- Escaneo OSV sobre SBOM CycloneDX (`security:enforce-osv`).
- SAST con CodeQL (`.github/workflows/codeql.yml`).
- Detección de secretos con Gitleaks (`.github/workflows/secret-scan.yml`).
- Política de excepciones temporales con expiración obligatoria (`security/audit-grace-policy.json`, `security/osv-exceptions.json`).

### Gating gradual en CI

- En `pull_request`: políticas de vulnerabilidades en **modo reporte** (`--enforce false`).
- En `push` a `main` y en `schedule`: políticas en **modo bloqueante** (`--enforce true`).

Esto permite visibilidad temprana en PR sin frenar el flujo, y enforcement estricto en ramas/procesos críticos.

### Ejecución local de checks de seguridad

Ejecuta cada control por separado:

```pwsh
bun run security:check-config
bun run security:check-exceptions-expiry
bun run security:audit
bun run security:enforce-audit -- --enforce true --threshold HIGH
bunx @cyclonedx/cyclonedx-npm --output-file sbom.cdx.json
bun run security:enforce-osv -- --enforce true --threshold HIGH
```

Flujo completo (pre-push):

```pwsh
bun run prepush:ci
```

### Gestión de excepciones temporales

Reglas obligatorias para cualquier excepción:

- Debe incluir siempre `reason` + `expiresOn`.
- La expiración debe ser corta y revisable.
- No usar excepciones permanentes.

Archivos de política:

- `security/audit-grace-policy.json`
  - `defaultThreshold` (por defecto `HIGH`)
  - `defaultGraceDays` (por defecto `14`)
  - `exceptions[]` (con vencimiento explícito)
  - `graceWindow[]` (ventana temporal por detección)
- `security/osv-exceptions.json`
  - `exceptions[]` (por `id`, opcionalmente `package`, con vencimiento)

### Política de rama main

No se deben desactivar checks de seguridad en `main`. Si un hallazgo requiere excepción, debe registrarse de forma temporal, con justificación y fecha de caducidad.

Si en el futuro agregas una dependencia legítima que necesite `postinstall`, apruébala explícitamente (en vez de habilitar ejecución global de scripts de dependencias).

### Modo estricto en CI

Se añadió el workflow `/.github/workflows/ci-security.yml` que en cada `push`/`PR` a `main`:

- valida que la política de hardening siga activa (`strictDepBuilds`, `blockExoticSubdeps`, `minimumReleaseAge`, `trustPolicy`, `preferFrozenLockfile`),
- falla si alguien habilita `dangerouslyAllowAllBuilds: true`,
- exige instalación reproducible con `bun install --frozen-lockfile`,
- compila la app (`bun run build`).

### Política para excepciones de `minimumReleaseAge`

- Añade excepciones de forma **puntual y versionada** (por ejemplo `postcss@8.5.9`).
- Evita excepciones por nombre sin versión para no abrir demasiado la superficie.
- Elimina excepciones cuando ya no sean necesarias tras una actualización normal del lockfile.

## Code scaffolding

Run `bun run ng g c componentName` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to crear los artefactos en `dist/`.

Puntos importantes tras la migración a Angular 21:

- Tailwind CSS: la integración se cambió para usar el plugin de PostCSS separado. El proyecto ya contiene una configuración válida:
  - `.postcssrc.json` con:

    ```json
    {
      "plugins": {
        "@tailwindcss/postcss": {}
      }
    }
    ```

  - En `src/styles.css` se usan las directivas:

    ```css
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    ```

    NO uses `@import "tailwindcss"` (esa forma puede provocar que el builder intente usar `tailwindcss` directamente como plugin PostCSS).

- `tailwind.config.js` incluye los paths de contenido y los plugins (por ejemplo `flowbite` / `tw-elements`) — si encuentras errores en tiempo de ejecución relacionados con `tw-elements`, revisa su versión o coméntalo temporalmente del `plugins` en `tailwind.config.js`.

  Recomendación específica para `tw-elements` en este proyecto:
  - Asegúrate de que `tailwind.config.js` incluya la ruta correcta hacia los scripts de `tw-elements` en `content`, por ejemplo:

    ```js
    content: ["./src/**/*.{html,ts}", "./node_modules/tw-elements/js/**/*.js"];
    ```

  - Y usa el plugin `plugin.cjs` desde la raíz del paquete:

    ```js
    plugins: [require("tw-elements/plugin.cjs")];
    ```

  (Estos ajustes ya están aplicados en la configuración del repo.)
  - tw-elements (runtime): la librería ahora se inicializa en los componentes que la usan mediante la función exportada `initTWE`.
    Ejemplo (ya aplicado en componentes de facturación):

    ```ts
    import { initTWE, Input } from "tw-elements";

    // en ngOnInit
    try {
      initTWE({ Input });
    } catch (e) {
      console.warn("tw-elements init failed:", e);
    }
    ```

    Nota: la versión incluida en este proyecto (tw-elements v2) expone `initTWE` y un conjunto de componentes (Input, Button, Dropdown, etc.). Algunas APIs antiguas como `initTE({ Datepicker })` no existen en esa versión — si dependes de componentes específicos (por ejemplo un datepicker) revisa la documentación o considera usar una librería alternativa.

    En este repositorio la aplicación mostrará una advertencia en la consola en tiempo de ejecución si detecta atributos `data-te-datepicker-init` en las plantillas para ayudarte a localizar el uso de datepicker y decidir si quieres sustituirlo por otra librería (por ejemplo `flatpickr` o `pikaday`).

- Si en algún momento se aplicaron parches manuales dentro de `node_modules` para sortear errores, elimina `node_modules` y reinstala dependencias para dejar todo reproducible:

```pwsh
rm -rf node_modules
bun install
```

Esto se hizo ya durante la migración.

## Running unit tests

Run `bun run test` (or `ng test`) to execute the unit tests with Vitest.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

---
