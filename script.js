const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const particleCount = 200; // Adjust for density

let mouse = {
    x: null,
    y: null
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Snowflake {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1; // Size variance
        this.speedY = Math.random() * 1 + 0.5; // Gravity
        this.speedX = Math.random() * 0.5 - 0.25; // Wind variance
        this.opacity = Math.random() * 0.7 + 0.3;
        this.swing = Math.random() * 0.02; // Side-to-side sway amount
        this.swingCount = Math.random() * Math.PI * 2;
    }

    update() {
        // Gravity
        this.y += this.speedY;

        // Wind / Sway
        this.swingCount += this.swing;
        this.x += Math.sin(this.swingCount) * 0.5 + this.speedX;

        // Interactive push (Wind from mouse)
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Push snow away slightly
            if (distance < 150) {
                const angle = Math.atan2(dy, dx);
                const force = (150 - distance) / 150;
                this.x -= Math.cos(angle) * force * 2;
                this.y -= Math.sin(angle) * force * 2;
            }
        }

        // Reset if off screen
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
            this.speedY = Math.random() * 1 + 0.5;
        }
        if (this.x > canvas.width) this.x = -10;
        if (this.x < -10) this.x = canvas.width;
    }

    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    // Calculate density based on screen size
    const count = (canvas.width * canvas.height) / 10000;
    for (let i = 0; i < count; i++) {
        particlesArray.push(new Snowflake());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// 3D Tilt Effect
const card = document.getElementById('card');
let currentRotateX = 0;
let currentRotateY = 0;
let targetRotateX = 0;
let targetRotateY = 0;

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

function updateTilt() {
    currentRotateX = lerp(currentRotateX, targetRotateX, 0.1);
    currentRotateY = lerp(currentRotateY, targetRotateY, 0.1);

    card.style.transform = `
        perspective(1000px)
        rotateX(${currentRotateX}deg)
        rotateY(${currentRotateY}deg)
        scale3d(1.02, 1.02, 1.02)
    `;

    requestAnimationFrame(updateTilt);
}

updateTilt();

card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetRotateY = ((x - centerX) / centerX) * 8;
    targetRotateX = -((y - centerY) / centerY) * 8;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
});

card.addEventListener('mouseleave', () => {
    targetRotateX = 0;
    targetRotateY = 0;
});

init();
animate();
