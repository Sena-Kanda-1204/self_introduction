function drawLines(data) {

    const container = document.querySelector(".timeline-lines");
    if (!container) return;

    container.innerHTML = "";

    const cards = document.querySelectorAll(".event-card");

    const colorMap = {};

    cards.forEach((card, i) => {

        const color = data[i]?.color;
        if (!color) return;

        const rect = card.getBoundingClientRect();
        const parentRect = container.getBoundingClientRect();

        const x = rect.left - parentRect.left + 10;
        const y = rect.top - parentRect.top + rect.height / 2;

        if (!colorMap[color]) {
            colorMap[color] = [];
        }

        colorMap[color].push({ x, y });
    });

    Object.entries(colorMap).forEach(([color, points], colorIndex) => {

        for (let i = 1; i < points.length; i++) {

            const prev = points[i - 1];
            const curr = points[i];

            const line = document.createElement("div");
            line.className = "timeline-line";

            const offset = colorIndex * -15;

            line.style.setProperty("--offset", offset + "px");
            line.style.top = prev.y + "px";
            line.style.height = (curr.y - prev.y) + "px";

            line.style.background = color;
            line.style.opacity = 1;

            container.appendChild(line);
        }
    });
}

window.drawLines = drawLines;
