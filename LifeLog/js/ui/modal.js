/* =========================
   モーダル
========================= */

function openEdit(id) {

    const event = DataManager.find(id);
    if (!event) return;

    window.currentEditId = id;

    document.getElementById("editTitle").value = event.title || "";
    document.getElementById("editDate").value = event.date || "";
    document.getElementById("editLocation").value = event.location || "";
    document.getElementById("editDescription").value = event.description || "";

    document.querySelectorAll("#editEmotions input").forEach(cb => {
        cb.checked = (event.emotions || []).includes(cb.value);
    });

    document.body.classList.add("modal-open");
    document.getElementById("editModal").classList.add("show");
}

function saveEdit() {

    const id = window.currentEditId;
    if (!id) return;

    DataManager.update(id, {
        title: document.getElementById("editTitle").value,
        date: document.getElementById("editDate").value,
        location: document.getElementById("editLocation").value,
        description: document.getElementById("editDescription").value,
        emotions: Array.from(
            document.querySelectorAll("#editEmotions input:checked")
        ).map(cb => cb.value)
    });

    rerender();
    closeModal();
}

function closeModal() {
    document.body.classList.remove("modal-open");
    document.getElementById("editModal").classList.remove("show");
}

function openImageModal(src, type) {

    document.body.classList.add("modal-open");

    const modal = document.getElementById("imageModal");
    const img = document.getElementById("expandedImage");
    const pdf = document.getElementById("pdfFrame");

    modal.classList.add("show");

    if (type === "image") {
        img.src = src;
        img.style.display = "block";
        pdf.style.display = "none";
    } else {
        pdf.src = src;
        pdf.style.display = "block";
        img.style.display = "none";
    }
}

function closeImageModal() {

    const modal = document.getElementById("imageModal");
    const img = document.getElementById("expandedImage");
    const pdf = document.getElementById("pdfFrame");

    modal.classList.remove("show");

    document.body.classList.remove("modal-open");

    if (img) img.src = "";
    if (pdf) pdf.src = "";
}

/* =========================
   Undo削除
========================= */

let lastDeletedEvent = null;

function deleteEvent() {

    const id = window.currentEditId;
    if (!id) return;

    const event = DataManager.find(id);
    if (!event) return;

    if (!confirm("削除しますか？")) return;

    lastDeletedEvent = { ...event };

    DataManager.delete(id);

    closeModal();
    rerender();

    showUndoToast("削除しました");
}


function undoDelete() {

    if (!lastDeletedEvent) return;

    DataManager.add(lastDeletedEvent);

    rerender();

    showToast("復元しました");

    lastDeletedEvent = null;
}

window.addEventListener("click", (e) => {

    document.querySelectorAll(".modal.show, .image-modal.show")
        .forEach(modal => {

            if (e.target === modal) {

                modal.classList.remove("show");
                document.body.classList.remove("modal-open");

                const img = document.getElementById("expandedImage");
                const pdf = document.getElementById("pdfFrame");

                if (img) img.src = "";
                if (pdf) pdf.src = "";
            }
        });
});


/* =========================
   キーボード操作
========================= */

window.addEventListener("keydown", (e) => {

    const editModal = document.getElementById("editModal");
    const searchModal = document.getElementById("searchModal");

    const isEditOpen = editModal?.classList.contains("show");
    const isSearchOpen = searchModal?.classList.contains("show");

    // ESC
    if (e.key === "Escape") {
        document.querySelectorAll(".modal.show, .image-modal.show")
            .forEach(m => m.classList.remove("show"));

        const img = document.getElementById("expandedImage");
        const pdf = document.getElementById("pdfFrame");

        if (img) img.src = "";
        if (pdf) pdf.src = "";

        document.body.classList.remove("modal-open");
        return;
    }


    // Delete
    if (e.key === "Delete" && isEditOpen) {

        if (e.target.tagName === "TEXTAREA") return;

        e.preventDefault();
        deleteEvent();
        return;
    }

    // Enter
    if (e.key !== "Enter") return;

    if (isEditOpen) {
        if (e.target.tagName === "TEXTAREA") return;
        e.preventDefault();
        saveEdit();
        return;
    }

    if (isSearchOpen) {
        e.preventDefault();
        executeSearch();
    }
});

/* =========================
   グローバル
========================= */

window.openEdit = openEdit;
window.saveEdit = saveEdit;
window.closeModal = closeModal;
window.deleteEvent = deleteEvent;
window.undoDelete = undoDelete;
window.openImageModal = openImageModal;
window.closeImageModal = closeImageModal;