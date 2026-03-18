// Seleção de elementos
const canvas = document.getElementById('particles-js');
const ctx = canvas.getContext('2d');
const audio = document.getElementById('bg-music');
const volumeSlider = document.getElementById('volume-slider');
const overlay = document.getElementById('entry-overlay');

// Configurações iniciais do Canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Classe para as partículas de neve
class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 1 + 0.2;
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.y += this.speedY;
        if (this.y > canvas.height) {
            this.y = -10;
            this.x = Math.random() * canvas.width;
        }
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

let particles = Array.from({ length: 100 }, () => new Particle());

// Função de animação do fundo
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { 
        p.update(); 
        p.draw(); 
    });
    requestAnimationFrame(animate);
}

// --- FUNÇÃO PRINCIPAL (DISPARADA AO CLICAR NA ARANHA) ---
function startExperience() {
    // 1. Toca a música (o navegador permite agora porque houve um clique)
    if (audio) {
        audio.volume = volumeSlider.value;
        audio.play().catch(e => console.log("Erro ao iniciar áudio:", e));
    }

    // 2. Esconde a Loadscreen com fade-out
    if (overlay) {
        overlay.classList.add('fade-out');
    }

    // 3. Inicia a animação das partículas
    animate();
}

// Lógica do Slider de Volume
volumeSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    if (audio) {
        audio.volume = val;
    }
});

// Ajuste de tela caso o usuário mude o tamanho da janela
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Reinicia partículas para preencher a nova tela
    particles = Array.from({ length: 100 }, () => new Particle());
});
