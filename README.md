# Tienda Angular

Este repositorio se ha migrado a Angular 21.0.1.

Nota: originalmente el proyecto se generó con Angular CLI v15.2.10; durante la migración se actualizaron dependencias y configuración para Angular 21.

## Development server

Usa el script de desarrollo habitual:

```pwsh
pnpm run start
```

El servidor se iniciará en `http://localhost:4200/` (o en otro puerto si 4200 está en uso). Si ves un mensaje acerca de la versión de Node.js, considera usar una versión LTS (por ejemplo 18.x o 20.x) en vez de una versión impar no-LTS.

## Code scaffolding

Run `pnpm ng g c componentName` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

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
pnpm install
```

Esto se hizo ya durante la migración.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

---
