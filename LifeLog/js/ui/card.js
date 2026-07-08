/* =========================
   カード
========================= */
function renderEventCard(event) {

    const classMap = {
        成長: "growth",
        挑戦: "challenge",
        達成感: "happy",
        楽しい: "fun",
        安心: "relax",
        不安: "anxiety",
        緊張: "tension"
    };

    const emotions = (event.emotions || [])
        .map(e =>
            `<span class="tag ${classMap[e] || "default-tag"}">
                ${escapeHTML(e)}
            </span>`
        )
        .join("");

    const isFav = event.favorite ? "active" : "";

    return `
        <div class="event-card"
             style="background:${event.bgColor || "white"}">

            ${event.startType ? `<div class="corner-badge start">始まり</div>` : ""}
            ${event.endType ? `<div class="corner-badge end">終わり</div>` : ""}

            <button class="edit-btn"
                onclick="openEdit('${event.id}')">✎</button>

            <button class="fav-btn ${isFav}"
                onclick="toggleFavorite('${event.id}')">★</button>

            <h2 class="title">${escapeHTML(event.title || "")}</h2>

            <p class="meta">${escapeHTML(event.date || "")}</p>

            <p class="desc">${escapeHTML(event.description || "")}</p>

            ${event.location ? `
            <p class="meta">
                📍 
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}"
                   target="_blank"
                   rel="noopener noreferrer">
                   ${escapeHTML(event.location)}
                </a>
            </p>
            ` : ""}

            <div class="emotion-tags">${emotions}</div>

            ${renderFile(event.file)}

        </div>
    `;
}

/* =========================
   ファイル表示
========================= */
function renderFile(file) {

    if (!file) return "";

    if (file.type?.startsWith("image/")) {
        return `
            <div class="file-preview">
                <img src="${file.data}" class="thumbnail"
                     onclick="openImageModal('${file.data}', 'image')">
            </div>
        `;
    }

    if (file.type === "application/pdf") {
        return `
            <div class="file-preview">
                📄 <a href="javascript:void(0)"
                   onclick="openImageModal('${file.data}', 'pdf')">
                   ${escapeHTML(file.name)}
                </a>
            </div>
        `;
    }

    return `
        <div class="file-preview">
            🖇 <a href="${file.data}" download="${escapeHTML(file.name)}">
                ${escapeHTML(file.name)}
            </a>
        </div>
    `;
}

/* =========================
   お気に入り
========================= */
function toggleFavorite(id) {

    const event = DataManager.find(id);
    if (!event) return;

    DataManager.update(id, {
        favorite: !event.favorite
    });

    window.eventsData = DataManager.getAll();
    rerender();
}

window.toggleFavorite = toggleFavorite;
window.renderEventCard = renderEventCard;
window.renderFile = renderFile;