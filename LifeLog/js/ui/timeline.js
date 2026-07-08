/* =========================
   タイムライン描画
========================= */
function renderTimeline(data, containerId = "timeline") {

    const timeline = document.getElementById(containerId);
    if (!timeline) return;

    let html = "";
    let lastYear = null;
    let lastMonth = null;

    const lineData = [];

    data.forEach((event, index) => {

        const d = new Date(event.date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;

        const showYear = year !== lastYear;
        const showMonth = month !== lastMonth || showYear;
        const showDot = showYear || showMonth;

        const yearId = `year-${year}`;

        html += `
        <section class="timeline-item">

            <div class="timeline-year"
                 ${showYear ? `id="${yearId}"` : ""}>

                ${showYear ? `<div class="year-big">${year}</div>` : ""}

            </div>

            <div class="timeline-month">
                ${showMonth ? `<div class="month-small">${month}月</div>` : ""}
            </div>

            <div class="timeline-content">

                ${showDot ? `<div class="timeline-dot"></div>` : ""}

                ${renderEventCard(event, index)}

            </div>

        </section>
        `;

        lineData.push({
            color: event.bgColor,
            index
        });

        lastYear = year;
        lastMonth = month;
    });

    if (data.length === 0) {

        timeline.innerHTML = `
            <div class="no-result">
                <p>🔍 検索結果が見つかりません</p>
                <small>条件を変更して再度お試しください</small>
            </div>
        `;

        return;
    }

    timeline.innerHTML = `
        <div class="timeline-lines"></div>
        ${html}
    `;


    // ✅ 年ナビ生成（select対応）
    renderYearNav(data);

    // ✅ 線描画
    setTimeout(() => drawLines(lineData), 0);
}

/* =========================
   年ナビ生成（分岐対応）
========================= */
function renderYearNav(data) {

    const nav = document.getElementById("yearNav");
    if (!nav) return;

    const years = [
        ...new Set(
            data.map(e => new Date(e.date).getFullYear())
        )
    ].sort((a, b) => a - b);

    const currentYear = new Date().getFullYear();

    // ✅ モバイル判定
    const isMobile = window.innerWidth <= 768;

    // ✅ 条件分岐（ここが今回のポイント）
    const threshold = isMobile ? 5 : 10;

    if (years.length <= threshold) {

        // ✅ ボタンUI
        nav.innerHTML = years.map(year => `
            <button class="year-btn"
                onclick="scrollToYear(${year})">
                ${year}
            </button>
        `).join("");

    } else {

        // ✅ プルダウンUI
        nav.innerHTML = `
            <select class="year-select"
                    onchange="scrollToYear(this.value)">

                <option value="">年を選択</option>

                ${years.map(year => `
                    <option value="${year}"
                        ${year === currentYear ? "selected" : ""}>
                        ${year}
                    </option>
                `).join("")}

            </select>
        `;
    }
}

/* =========================
   年ジャンプ
========================= */
function scrollToYear(year) {

    const el = document.getElementById(`year-${year}`);
    if (!el) return;

    el.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* =========================
   スクロール連動（④対応）
========================= */

let currentActiveYear = null;

window.addEventListener("scroll", () => {

    const yearEls = document.querySelectorAll(".timeline-year[id]");
    let detected = null;

    yearEls.forEach(el => {

        const rect = el.getBoundingClientRect();

        // ✅ 判定ライン（調整可）
        if (rect.top >= 0 && rect.top < 150) {
            detected = el.id.replace("year-", "");
        }
    });

    if (!detected || detected === currentActiveYear) return;

    currentActiveYear = detected;

    // ✅ ボタンUI更新
    document.querySelectorAll(".year-btn")
        .forEach(btn => {
            btn.classList.toggle(
                "active",
                btn.textContent.trim() == detected
            );
        });

    // ✅ select UI更新（←今回のポイント）
    const select = document.querySelector(".year-select");
    if (select) {
        select.value = detected;
    }

});

/* =========================
   再描画
========================= */
window.renderTimeline = renderTimeline;
window.rerender = () => {

    const data = DataManager.getAll()
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    renderTimeline(data);
};


/* =========================
   グローバル
========================= */
window.scrollToYear = scrollToYear;

/* =========================
   リサイズ対応（年ナビ再生成）
========================= */
let resizeTimer;

window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
        renderYearNav(DataManager.getAll());
    }, 200);
});