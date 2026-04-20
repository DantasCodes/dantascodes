// Seleção de elementos
const video = document.getElementById('bg-video');
const volumeSlider = document.getElementById('volume-slider');
const muteBtn = document.getElementById('mute-btn');
const icon = document.getElementById('volume-icon');
const overlay = document.getElementById('entry-overlay');

// Controle para evitar múltiplos cliques
let started = false;
let lastVolume = 50;

// Efeito de digitação
const phrases = [
    "✧ Ola, eu sou o Dantas🤍",
    "✧ Programador",
    "✧ Streamer",
    "✧ Criador de Conteúdo"
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const dynamicText = document.getElementById('dynamic-text');

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        dynamicText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        dynamicText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }
    
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
        return;
    }
    
    if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    
    const speed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, speed);
}

// Iniciar efeito de digitação quando a página carregar
if (dynamicText) {
    setTimeout(typeEffect, 500);
}

// Função para atualizar o ícone de volume
function updateIcon(isMuted) {
    if (isMuted) {
        icon.innerHTML = '<path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.4,12.58C16.46,12.39 16.5,12.2 16.5,12Z" />';
    } else {
        icon.innerHTML = '<path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16.04C15.5,15.29 16.5,13.77 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />';
    }
}

// --- FUNÇÃO PRINCIPAL (DISPARADA AO CLICAR NA ARANHA) ---
function startExperience() {
    if (started) return;
    started = true;
    
    if (video) {
        const volumeValue = volumeSlider.value / 100;
        video.volume = volumeValue;
        video.muted = false;
        video.play().catch(e => console.log("Erro ao iniciar vídeo:", e));
    }
    
    if (video) {
        video.addEventListener('error', () => {
            console.log('Vídeo não encontrado, verificando o caminho: assets/video/Espresso.mp4');
            if (volumeSlider) volumeSlider.disabled = true;
            if (muteBtn) muteBtn.disabled = true;
        });
    }

    if (overlay) {
        overlay.classList.add('fade-out');
    }
}

// Lógica do botão Mudo / Desmudo
if (muteBtn) {
    muteBtn.addEventListener('click', () => {
        if (video) {
            if (!video.muted && video.volume > 0) {
                lastVolume = video.volume * 100;
                video.muted = true;
                volumeSlider.value = 0;
                updateIcon(true);
            } else {
                video.muted = false;
                video.volume = lastVolume / 100;
                volumeSlider.value = lastVolume;
                updateIcon(false);
            }
        }
    });
}

// Atualizar ícone conforme o slider
if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        updateIcon(value == 0);
        if (video) {
            video.muted = false;
            video.volume = value / 100;
        }
    });
}

// Sincronizar slider com volume inicial do vídeo
if (video && volumeSlider) {
    video.volume = volumeSlider.value / 100;
    video.muted = true;
}

// Garantir que o vídeo tente carregar
if (video) {
    video.load();
}