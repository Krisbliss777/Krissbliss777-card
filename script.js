const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const colors = ['#d946ef', '#8b5cf6', '#06b6d4', '#ffffff']; // Added Cyan for more pop
const maxDistance = 120;
let mouse = {
    x: null,
    y: null,
    radius: 200
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.5 + 0.5; // Larger particles (0.5 to 3.0)
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 20) + 1;
        this.speedX = Math.random() * 0.6 - 0.3; // Faster movement
        this.speedY = Math.random() * 0.6 - 0.3;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.6 + 0.2; // More visible (0.2 to 0.8)
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = mouse.radius;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * this.density * 0.6; // Reduced force
                const directionY = forceDirectionY * force * this.density * 0.6;
                this.x -= directionX;
                this.y -= directionY;
            }
        }

        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

function init() {
    particlesArray = [];
    const particleCount = (canvas.width * canvas.height) / 15000; // Responsive count
    for (let i = 0; i < particleCount; i++) {
        particlesArray.push(new Particle());
    }
}

function connectParticles() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                const opacity = 1 - (distance / maxDistance);
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.05})`; // Very subtle lines
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Smoother 3D Tilt Effect with Lerp
const card = document.getElementById('card');
const cardGlow = document.querySelector('.card-glow');

let currentRotateX = 0;
let currentRotateY = 0;
let targetRotateX = 0;
let targetRotateY = 0;

// Linear interpolation function
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

    // Calculate rotation (max 10 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetRotateY = ((x - centerX) / centerX) * 8;
    targetRotateX = -((y - centerY) / centerY) * 8;

    // Update glow position
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
});

card.addEventListener('mouseleave', () => {
    targetRotateX = 0;
    targetRotateY = 0;
});

init();
animate();
