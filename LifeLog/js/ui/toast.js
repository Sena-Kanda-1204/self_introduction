/* =========================
   通常トースト
========================= */
function showToast(message) {

    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
}


/* =========================
   Undo付きトースト
========================= */
function showUndoToast(message) {

    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.innerHTML = `
        <span>${message}</span>
        <button class="undo-btn" onclick="undoDelete()">元に戻す</button>
    `;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
        toast.innerHTML = "";
    }, 5000);
}


/* =========================
   グローバル
========================= */
window.showToast = showToast;
window.showUndoToast = showUndoToast;