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

function initContactForm() {

    const form = document.getElementById("contact-form");

    if (!form) return;

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        const formData = new FormData(form);

        try {

            const response = await fetch(form.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });

            if (response.ok) {

                window.location.href = "../pages/thanks.html";

            } else {

                alert("送信に失敗しました。\n時間をおいて再度お試しください。");

            }

        } catch (error) {

            alert("通信エラーが発生しました。");

        }

    });

}