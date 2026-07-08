/* =========================
   検索モーダル
========================= */

function openSearchModal() {

    document.body.classList.add("modal-open");

    document.getElementById("searchModal")
        ?.classList.add("show");
}

function closeSearchModal() {

    document.body.classList.remove("modal-open");

    document.getElementById("searchModal")
        ?.classList.remove("show");
}

/* =========================
   検索
========================= */

function executeSearch() {

    const keyword = document.getElementById("keyword1").value.trim();
    const color = document.getElementById("searchColor").value;

    const data = DataManager.getAll();

    const filtered = data.filter(event => {

        // キーワード
        if (keyword && !event.title.includes(keyword)) return false;

        // ✅ カラー
        if (color) {

            // 色付き
            if (color !== "none") {
                if (event.bgColor !== color) return false;
            }

            // 白（未設定）
            if (color === "none") {
                if (event.bgColor) return false;
            }
        }

        return true;
    });

    // ✅ ✅ ソート必須
    const result = filtered.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    renderTimeline(result);
    closeSearchModal();
}

function applySearch() {

    if (!window.currentSearchState) {
        renderTimeline(DataManager.getAll());
        return;
    }

    const {
        keyword1,
        keyword2,
        mode,
        from,
        to,
        emotions,
        favOnly,
        color
    } = window.currentSearchState;

    const all = DataManager.getAll();

    // ✅ ① 色対象イベント抽出
    let colorEvents = all;

    if (color) {
        colorEvents = all.filter(e => e.bgColor === color);

        if (colorEvents.length === 0) {
            renderTimeline([]);
            return;
        }

        // ✅ ② 期間取得（最初と最後）
        const dates = colorEvents.map(e => new Date(e.date));

        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));

        // ✅ ③ 期間内に絞る（ここが重要）
        colorEvents = all.filter(e => {
            const d = new Date(e.date);
            return d >= minDate && d <= maxDate;
        });
    }

    // ✅ ④ 通常検索条件
    const filtered = colorEvents.filter(e => {

        const text =
            (e.title || "").toLowerCase() +
            (e.description || "").toLowerCase() +
            (e.location || "").toLowerCase();

        let matchKeyword = true;

        if (keyword1 && keyword2) {

            if (mode === "and") {
                matchKeyword =
                    text.includes(keyword1) &&
                    text.includes(keyword2);
            } else {
                matchKeyword =
                    text.includes(keyword1) ||
                    text.includes(keyword2);
            }

        } else if (keyword1) {
            matchKeyword = text.includes(keyword1);
        } else if (keyword2) {
            matchKeyword = text.includes(keyword2);
        }

        const matchFrom =
            !from || e.date >= from;

        const matchTo =
            !to || e.date <= to;

        const matchEmotion =
            emotions.length === 0 ||
            (e.emotions || []).some(em =>
                emotions.includes(em)
            );

        const matchFavorite =
            !favOnly || e.favorite;

        return (
            matchKeyword &&
            matchFrom &&
            matchTo &&
            matchEmotion &&
            matchFavorite
        );
    });

    renderTimeline(filtered);
}

function setupSearchColorPalette() {

    const palette = document.getElementById("searchColorPalette");
    const hidden = document.getElementById("searchColor");

    if (!palette) return;

    palette.querySelectorAll(".color-dot")
        .forEach(dot => {

        dot.addEventListener("click", () => {

            // 選択状態リセット
            palette.querySelectorAll(".color-dot")
                .forEach(d => d.classList.remove("selected"));

            // 選択
            dot.classList.add("selected");

            // 値セット
            hidden.value = dot.dataset.color || "";
        });
    });
}

document.addEventListener("click", (e) => {

    const dot = e.target.closest(".color-dot");
    if (!dot) return;

    const palette = dot.parentElement;

    // 全解除
    palette.querySelectorAll(".color-dot")
        .forEach(d => d.classList.remove("selected"));

    // 選択
    dot.classList.add("selected");

    // hiddenに反映
    const hidden = document.getElementById("searchColor");
    if (hidden) {
        hidden.value = dot.dataset.color || "";
    }
});

function resetSearch() {

    const keyword1 = document.getElementById("keyword1")?.value.trim();
    const keyword2 = document.getElementById("keyword2")?.value.trim();
    const fromDate = document.getElementById("fromDate")?.value;
    const toDate = document.getElementById("toDate")?.value;
    const emotionChecked = document.querySelectorAll("#searchModal .emotion-form input:checked");
    const color = document.getElementById("searchColor")?.value;
    const favOnly = document.getElementById("favOnly")?.checked;

    // ✅ 全部空か判定
    const isEmpty =
        !keyword1 &&
        !keyword2 &&
        !fromDate &&
        !toDate &&
        !color &&
        !favOnly &&
        emotionChecked.length === 0;

    // ✅ 入力リセット
    document.getElementById("keyword1").value = "";
    document.getElementById("keyword2").value = "";
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    document.querySelectorAll("#searchModal .emotion-form input").forEach(cb => cb.checked = false);
    document.getElementById("searchColor").value = "";
    document.getElementById("favOnly").checked = false;

    // ✅ カラー選択UIリセット
    document.querySelectorAll("#searchColorPalette .color-dot")
        .forEach(dot => dot.classList.remove("selected"));

    // ✅ ✅ 重要：挙動分岐
    if (isEmpty) {
        // → 初期タイムラインに戻す
        rerender();

        // → モーダル閉じる
        closeSearchModal();
    }
}


window.openSearchModal = openSearchModal;
window.closeSearchModal = closeSearchModal;
window.executeSearch = executeSearch;
window.resetSearch = resetSearch;
window.applySearch = applySearch;