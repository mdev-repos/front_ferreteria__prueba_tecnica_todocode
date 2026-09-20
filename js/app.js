// ------------------------------------------------------------------
// Lógica de la pantalla: renderizar la tabla, manejar los formularios
// (crear / editar) y las acciones de la tabla (editar / eliminar).
// ------------------------------------------------------------------

const CATEGORY_LABELS = {
    HAND_TOOL: "Herramienta manual",
    POWER_TOOL: "Herramienta eléctrica",
    BATTERY_TOOL: "Herramienta a batería",
    MEASURING_TOOL: "Instrumento de medición"
};

const toolsTableBody = document.querySelector("#tools-table tbody");
const emptyState = document.querySelector("#empty-state");

const createForm = document.querySelector("#create-form");
const createFeedback = document.querySelector("#create-feedback");

const editModal = document.querySelector("#edit-modal");
const editForm = document.querySelector("#edit-form");
const editFeedback = document.querySelector("#edit-feedback");
const cancelEditBtn = document.querySelector("#cancel-edit");

// ---------- Render ----------

function renderTools(tools) {
    toolsTableBody.innerHTML = "";

    if (tools.length === 0) {
        emptyState.hidden = false;
        return;
    }
    emptyState.hidden = true;

    for (const tool of tools) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tool.id}</td>
            <td>${escapeHtml(tool.name)}</td>
            <td>${escapeHtml(tool.brand)}</td>
            <td>${CATEGORY_LABELS[tool.category] ?? tool.category}</td>
            <td>$${tool.price.toFixed(2)}</td>
            <td>${tool.stock}</td>
            <td class="actions">
                <button class="btn btn-small btn-edit" data-id="${tool.id}">Editar</button>
                <button class="btn btn-small btn-danger" data-id="${tool.id}">Eliminar</button>
            </td>
        `;
        toolsTableBody.appendChild(row);
    }

    toolsTableBody.querySelectorAll(".btn-edit").forEach(btn =>
        btn.addEventListener("click", () => openEditModal(Number(btn.dataset.id), tools))
    );
    toolsTableBody.querySelectorAll(".btn-danger").forEach(btn =>
        btn.addEventListener("click", () => handleDelete(Number(btn.dataset.id)))
    );
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
}

async function loadTools() {
    emptyState.hidden = true;
    toolsTableBody.innerHTML = `<tr><td colspan="7">Cargando inventario… (si la API está "dormida" por inactividad, Render puede tardar hasta ~50s en despertar)</td></tr>`;

    try {
        const tools = await fetchAllTools();
        renderTools(tools);
    } catch (err) {
        console.error(err);
        toolsTableBody.innerHTML = `
            <tr><td colspan="7">
                No se pudo conectar con la API. Si el backend está en Render y llevaba un
                rato sin uso, puede seguir despertando — probá
                <button type="button" id="retry-load" class="btn btn-small btn-secondary">reintentar</button>.
            </td></tr>`;
        document.querySelector("#retry-load")?.addEventListener("click", loadTools);
    }
}

// ---------- Crear ----------

createForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    createFeedback.textContent = "";

    const formData = new FormData(createForm);
    const toolData = {
        name: formData.get("name"),
        brand: formData.get("brand"),
        category: formData.get("category"),
        price: Number(formData.get("price")),
        stock: Number(formData.get("stock")),
        description: formData.get("description") || null
    };

    try {
        await createTool(toolData);
        createForm.reset();
        createFeedback.textContent = "Herramienta creada correctamente.";
        createFeedback.className = "feedback feedback-success";
        await loadTools();
    } catch (err) {
        createFeedback.textContent = err.message;
        createFeedback.className = "feedback feedback-error";
    }
});

// ---------- Editar ----------

function openEditModal(id, tools) {
    const tool = tools.find(t => t.id === id);
    if (!tool) return;

    editForm.elements["id"].value = tool.id;
    editForm.elements["name"].value = tool.name;
    editForm.elements["brand"].value = tool.brand;
    editForm.elements["category"].value = tool.category;
    editForm.elements["price"].value = tool.price;
    editForm.elements["stock"].value = tool.stock;
    editForm.elements["description"].value = tool.description ?? "";

    editFeedback.textContent = "";
    editModal.showModal();
}

cancelEditBtn.addEventListener("click", () => editModal.close());

editForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    editFeedback.textContent = "";

    const formData = new FormData(editForm);
    const id = formData.get("id");
    const toolData = {
        name: formData.get("name") || null,
        brand: formData.get("brand") || null,
        category: formData.get("category") || null,
        price: formData.get("price") ? Number(formData.get("price")) : null,
        stock: formData.get("stock") ? Number(formData.get("stock")) : null,
        description: formData.get("description") || null
    };

    try {
        await updateTool(id, toolData);
        editModal.close();
        await loadTools();
    } catch (err) {
        editFeedback.textContent = err.message;
        editFeedback.className = "feedback feedback-error";
    }
});

// ---------- Eliminar ----------

async function handleDelete(id) {
    if (!confirm("¿Seguro que querés eliminar esta herramienta?")) return;

    try {
        await deleteTool(id);
        await loadTools();
    } catch (err) {
        alert(err.message);
    }
}

// ---------- Arranque ----------

loadTools();
