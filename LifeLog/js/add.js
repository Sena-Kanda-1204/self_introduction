let attachedFile = null;

document.addEventListener("DOMContentLoaded", init);

/* =========================
   初期化
========================= */
async function init() {
    await DataManager.init();

    validateForm();
    setupListeners();
    setupFileListener();
    setupStageListener();
    setupColorPalette();
    enhanceStageSelect();
    setupColorUsageTooltip();
}

/* =========================
   バリデーション
========================= */
function validateForm() {

    const title =
        document.getElementById("title")?.value.trim();

    const date =
        document.getElementById("date")?.value;

    const description =
        document.getElementById("description")?.value.trim();

    const btn =
        document.getElementById("addBtn");

    if (!btn) return;

    btn.disabled = !(title && date && description);
}

function setupListeners() {

    ["title", "date", "description"]
        .forEach(id => {

        document.getElementById(id)
            ?.addEventListener("input", validateForm);
    });
}

/* =========================
   ステージ切替
========================= */
function setupStageListener() {

    const stage =
        document.getElementById("lifeStage");

    const colorBox =
        document.getElementById("colorPickerBox");

    if (!stage) return;

    stage.addEventListener("change", () => {

        if (stage.value) {

            colorBox.style.display = "block";

        } else {

            colorBox.style.display = "none";
        }
    });
}

/* =========================
   プルダウンUI
========================= */
function enhanceStageSelect() {

    const select =
        document.getElementById("lifeStage");

    if (!select) return;

    const updateUI = () => {

        select.classList.remove(
            "start-selected",
            "end-selected",
            "empty"
        );

        if (!select.value) {
            select.classList.add("empty");
        }

        if (select.value === "start") {
            select.classList.add("start-selected");
        }

        if (select.value === "end") {
            select.classList.add("end-selected");
        }
    };

    updateUI();

    select.addEventListener("change", updateUI);
}

/* =========================
   カラーパレット
========================= */
function setupColorPalette() {

    const palette =
        document.getElementById("colorPalette");

    const hidden =
        document.getElementById("bgColor");

    if (!palette) return;

    palette.querySelectorAll(".color-dot")
        .forEach(dot => {

        dot.addEventListener("click", () => {

            palette.querySelectorAll(".color-dot")
                .forEach(d =>
                    d.classList.remove("selected")
                );

            dot.classList.add("selected");

            hidden.value = dot.dataset.color;
        });
    });
}

/* =========================
   ファイル
========================= */
function setupFileListener() {

    const input =
        document.getElementById("fileInput");

    const status =
        document.getElementById("fileStatus");

    if (!input) return;

    input.addEventListener("change", e => {

        const file = e.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = event => {

            attachedFile = {
                name: file.name,
                type: file.type,
                data: event.target.result
            };

            status.textContent =
                `添付済み：${file.name}`;
        };

        reader.readAsDataURL(file);
    });
}

function setCurrentLocation() {

    const status = document.getElementById("locationStatus");

    if (!navigator.geolocation) {
        status.textContent = "位置情報が使えません";
        return;
    }

    status.textContent = "取得中...";

    navigator.geolocation.getCurrentPosition(
        async (pos) => {

            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                );
                const data = await res.json();

                const addr = data.address || {};

                const formatted = [
                    addr.country,
                    addr.state,
                    addr.city || addr.town || addr.village || addr.county,
                    addr.suburb || addr.neighbourhood || addr.quarter,
                    addr.road || addr.residential || addr.pedestrian || addr.hamlet,
                    addr.house_number
                ]
                .filter(Boolean)
                .join("");

                document.getElementById("location").value = formatted;

                status.textContent = "取得成功！";

            } catch {
                document.getElementById("location").value =
                    `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

                status.textContent = "座標で取得しました";
            }
        },
        (err) => {
            status.textContent = "取得失敗：" + err.message;
        }
    );
}

/* =========================
   追加
========================= */
function addEvent() {

    const stage =
        document.getElementById("lifeStage")?.value;

    const bgColor =
        document.getElementById("bgColor")?.value;

    const newEvent = {

        id: crypto.randomUUID(),

        title:
            document.getElementById("title").value,

        date:
            document.getElementById("date").value,

        description:
            document.getElementById("description").value,

        location:
            document.getElementById("location").value,

        emotions: Array.from(
            document.querySelectorAll(
                ".emotion-form input:checked"
            )
        ).map(cb => cb.value),

        file: attachedFile,

        favorite: false,

        startType: stage === "start",

        endType: stage === "end",

        bgColor: stage ? bgColor : ""
    };

    DataManager.add(newEvent);

    // トースト表示
    sessionStorage.setItem("toast", "追加しました");

    // ページ遷移
    window.location.href = "index.html";
}

/* =========================
   カラー使用状況ツールチップ
========================= */
function setupColorUsageTooltip() {

    const palette =
        document.getElementById("colorPalette");

    if (!palette) return;

    // ツールチップ生成
    const tooltip = document.createElement("div");

    tooltip.className = "color-tooltip";

    document.body.appendChild(tooltip);

    palette.querySelectorAll(".color-dot")
        .forEach(dot => {

        const color = dot.dataset.color;

        dot.addEventListener("mouseenter", (e) => {

            // 使用イベント抽出
            const events =
                DataManager.getAll()
                    .filter(ev => ev.bgColor === color);

            if (events.length === 0) {

                tooltip.textContent =
                    "使用されていません";

            } else {

                const names = events
                    .slice(0, 5)
                    .map(ev => "・" + ev.title)
                    .join("<br>");

                const more =
                    events.length > 5
                    ? `<br>...他 ${events.length - 5} 件`
                    : "";

                tooltip.innerHTML = `
                    <strong>使用中のイベント</strong><br>
                    ${names}${more}
                `;
            }

            tooltip.style.left =
                e.pageX + 10 + "px";

            tooltip.style.top =
                e.pageY + 10 + "px";

            tooltip.classList.add("show");
        });

        dot.addEventListener("mousemove", (e) => {

            tooltip.style.left =
                e.pageX + 10 + "px";

            tooltip.style.top =
                e.pageY + 10 + "px";
        });

        dot.addEventListener("mouseleave", () => {

            tooltip.classList.remove("show");
        });
    });
}

window.addEvent = addEvent;