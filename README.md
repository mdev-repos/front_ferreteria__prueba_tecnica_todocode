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

Un solo punto de configuración: [`js/config.js`](js/config.js). Detecta automáticamente
dónde está corriendo el front, sin necesidad de editar nada a mano según el entorno:

```js
const API_BASE_URL =
  (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "http://localhost:8080"                    // servido en local -> backend local
    : "https://api-ferreteria-prueba-tecnica-todocode.onrender.com"; // servido en cualquier otro dominio (ej. GitHub Pages) -> backend deployado
```

> **Backend en la nube dado de baja.** El segundo caso del código (cualquier dominio que no
> sea `localhost`) apunta a un despliegue que ya no está activo, así que la demo publicada
> en GitHub Pages no tiene API a la que consultar. El front se usa **en local**: clonando
> este repo y el de la API, y levantando la API con Docker Compose o a mano (ver el
> [README de la API](https://github.com/mdev-repos/api_ferreteria__prueba_tecnica_todocode)).
> Un despliegue completo y activo de punta a punta es el de
> [Bazar](https://github.com/mdev-repos/api_bazar__ejercicio_curso_todocode).


## Estructura

```
index.html          página única, con el formulario de alta y la tabla de inventario
css/style.css        estilos, sin frameworks
js/config.js          URL base de la API (el único archivo a tocar para el deploy)
js/api.js             funciones que hablan con la API (fetch), nada de DOM acá
js/app.js              lógica de pantalla: render de la tabla, formularios, modal de edición
```
