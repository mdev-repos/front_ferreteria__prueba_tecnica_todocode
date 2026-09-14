// ------------------------------------------------------------------
// Único punto de configuración del front. Cuando dockericemos y
// deployemos el back, esta es la ÚNICA línea que hay que cambiar:
// reemplazar la URL local por la URL pública del servidor.
// ------------------------------------------------------------------
const API_BASE_URL = "http://localhost:8080";
