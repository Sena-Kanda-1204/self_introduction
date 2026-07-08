/* =========================
   初期化
========================= */

async function init() {

    await DataManager.init();

    window.eventsData = DataManager.getAll();

    sortAndRender();
}


/* =========================
   ソート＋描画
========================= */
function sortAndRender() {

    const data = DataManager.getAll()
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    renderTimeline(data);
}


/* =========================
   起動
========================= */
document.addEventListener("DOMContentLoaded", init);