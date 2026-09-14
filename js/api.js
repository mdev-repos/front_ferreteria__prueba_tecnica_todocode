// ------------------------------------------------------------------
// Capa de acceso a la API — el único lugar del front que sabe que
// existe un backend REST. app.js nunca llama a fetch() directamente,
// siempre pasa por estas funciones (mismo principio de "separar
// capas" que venimos aplicando del lado del backend).
// ------------------------------------------------------------------

async function fetchAllTools() {
    const response = await fetch(`${API_BASE_URL}/tools/all`);
    if (!response.ok) {
        throw new Error("No se pudo obtener el listado de herramientas");
    }
    return response.json();
}

async function createTool(toolData) {
    const response = await fetch(`${API_BASE_URL}/tools/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toolData)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "No se pudo crear la herramienta");
    }

    return response.json();
}

async function updateTool(id, toolData) {
    const response = await fetch(`${API_BASE_URL}/tools/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toolData)
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "No se pudo actualizar la herramienta");
    }

    return response.json();
}

async function deleteTool(id) {
    const response = await fetch(`${API_BASE_URL}/tools/${id}`, {
        method: "DELETE"
    });

    if (!response.ok) {
        throw new Error("No se pudo eliminar la herramienta");
    }
    // 204 No Content: no hay body que parsear, no devolvemos nada
}
