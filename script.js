document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.2 });

    // Наблюдаем за проектами
    document.querySelectorAll(".project").forEach((project) => {
        observer.observe(project);
    });

    // Наблюдаем за секциями
    document.querySelectorAll(".section").forEach((section) => {
        observer.observe(section.querySelector("h2"));
    });
});

// Частицы

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor(x, y, size, speedX, speedY, depth) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.depth = depth;
        this.color = "#fff"; // Начальный цвет (для светлой темы)
        this.parallaxOffsetX = 0;
        this.parallaxOffsetY = 0;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.parallaxOffsetX, this.y + this.parallaxOffsetY, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    update(scrollOffsetX, scrollOffsetY) {
        this.parallaxOffsetX = scrollOffsetX * this.depth;
        this.parallaxOffsetY = scrollOffsetY * this.depth;

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

        this.draw();
    }
}

const particlesArray = [];
const numberOfParticles = 50;

function init() {
    for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 5 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 2 - 1;
        const speedY = Math.random() * 2 - 1;
        const depth = Math.random() * 0.5 + 0.1;
        particlesArray.push(new Particle(x, y, size, speedX, speedY, depth));
    }
}

let scrollOffsetX = 0;
let scrollOffsetY = 0;

// Координаты курсора
let cursorX = 0;
let cursorY = 0;

window.addEventListener("mousemove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
});

function connectParticles() {
    const connectionDistance = 150; // Максимальное расстояние для связи частиц

    // Связываем частицы между собой
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / connectionDistance})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x + particlesArray[a].parallaxOffsetX, particlesArray[a].y + particlesArray[a].parallaxOffsetY);
                ctx.lineTo(particlesArray[b].x + particlesArray[b].parallaxOffsetX, particlesArray[b].y + particlesArray[b].parallaxOffsetY);
                ctx.stroke();
            }
        }
    }

    // Связываем частицы с курсором
    particlesArray.forEach((particle) => {
        const dx = particle.x - cursorX;
        const dy = particle.y - cursorY;
        const distanceToCursor = Math.sqrt(dx * dx + dy * dy);

        if (distanceToCursor < connectionDistance) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distanceToCursor / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x + particle.parallaxOffsetX, particle.y + particle.parallaxOffsetY);
            ctx.lineTo(cursorX, cursorY);
            ctx.stroke();
        }
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach((particle) => particle.update(scrollOffsetX, scrollOffsetY));
    connectParticles(); // Рисуем линии между частицами и курсором
    requestAnimationFrame(animate);
}

init();
animate();

window.addEventListener("scroll", () => {
    scrollOffsetX = window.scrollX;
    scrollOffsetY = window.scrollY;
});

// Функция для обновления цвета частиц
function updateParticleColors(isDarkTheme) {
    const newColor = isDarkTheme ? "#333" : "#fff";
    particlesArray.forEach((particle) => {
        particle.color = newColor;
    });
}

// Переключение темы
const themeToggle = document.getElementById("theme-toggle");
const icon = themeToggle.querySelector("i");

function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-theme");

    const isDarkTheme = body.classList.contains("dark-theme");
    updateParticleColors(isDarkTheme);

    if (isDarkTheme) {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
    } else {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
    }

    localStorage.setItem("theme", isDarkTheme ? "dark" : "light");
}

themeToggle.addEventListener("click", toggleTheme);

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    updateParticleColors(true);
} else {
    updateParticleColors(false);
}