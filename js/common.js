function initHamburger() {
    const hamburger = document.getElementById("js-hamburger");
    const blackBg = document.getElementById("js-black-bg");

    if (!hamburger || !blackBg) return;

    hamburger.addEventListener("click", () => {
        document.body.classList.toggle("nav-open");
    });

    blackBg.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
    });
}