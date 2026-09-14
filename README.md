# Front Ferretería — TodoCode

Front vanilla (HTML + CSS + JS, sin frameworks ni dependencias) para consumir la API
[`api_ferreteria__prueba_tecnica_todocode`](../api_ferreteria__prueba_tecnica_todocode).

## Cómo correrlo en local

Necesita servirse por HTTP (no abrir el `index.html` directo con `file://`, porque los
`fetch` a la API pueden fallar por política de orígenes del navegador). Cualquier
servidor estático simple alcanza, por ejemplo:

```bash
python3 -m http.server 5500
```

y abrir `http://localhost:5500`. También funciona con la extensión *Live Server* de
VS Code/IntelliJ, o cualquier otro servidor estático.

## Configuración de la URL de la API

Un solo punto de configuración: [`js/config.js`](js/config.js).

```js
const API_BASE_URL = "http://localhost:8080";
```


## Estructura

```
index.html          página única, con el formulario de alta y la tabla de inventario
css/style.css        estilos, sin frameworks
js/config.js          URL base de la API (el único archivo a tocar para el deploy)
js/api.js             funciones que hablan con la API (fetch), nada de DOM acá
js/app.js              lógica de pantalla: render de la tabla, formularios, modal de edición
```
