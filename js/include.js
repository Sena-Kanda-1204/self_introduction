async function loadComponent(id, file) {

    const response = await fetch(file);

    if (!response.ok) {
        throw new Error(`${file} の読み込みに失敗しました。`);
    }

    document.getElementById(id).innerHTML = await response.text();

    fixPath(id);

    if (id === "header" && typeof initHamburger === "function") {
        initHamburger();
    }
}


function fixPath(id) {

    const inPages = location.pathname.includes("/pages/");
    const base = inPages ? "../" : "";

    const target = document.getElementById(id);

    target.querySelectorAll("[data-href]").forEach(el => {
        el.href = base + el.dataset.href;
    });

    target.querySelectorAll("[data-src]").forEach(el => {
        el.src = base + el.dataset.src;
    });
}


const inPages = location.pathname.includes("/pages/");

Promise.all([
    loadComponent(
        "header",
        (inPages ? "../" : "") + "components/header.html"
    ),
    loadComponent(
        "footer",
        (inPages ? "../" : "") + "components/footer.html"
    )
]).then(() => {

    if (typeof initContactForm === "function") {
        initContactForm();
    }

});