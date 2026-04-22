// Seleção de elementos = DANTAS
const video = document.getElementById('bg-video');
const volumeSlider = document.getElementById('volume-slider');
const muteBtn = document.getElementById('mute-btn');
const icon = document.getElementById('volume-icon');
const overlay = document.getElementById('entry-overlay');

// Controle para evitar múltiplos cliques = DANTAS
let started = false;
let lastVolume = 50;

// Efeito de digitação = DANTAS
const phrases = [
    "✧ Ola, eu sou o Dantas 🤍",
    "✧ Programador",
    "✧ Criador de Conteúdo",
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

// Iniciar efeito de digitação quando a página carregar = DANTAS
if (dynamicText) {
    setTimeout(typeEffect, 500);
}

// Função para atualizar o ícone de volume = DANTAS
function updateIcon(isMuted) {
    if (isMuted) {
        icon.innerHTML = '<path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.4,12.58C16.46,12.39 16.5,12.2 16.5,12Z" />';
    } else {
        icon.innerHTML = '<path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16.04C15.5,15.29 16.5,13.77 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />';
    }
}

// --- FUNÇÃO PRINCIPAL (DISPARADA AO CLICAR NA ARANHA) --- = DANTAS
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
            console.log('Vídeo não encontrado, verificando o caminho: assets/video/ENDS.mp4');
            if (volumeSlider) volumeSlider.disabled = true;
            if (muteBtn) muteBtn.disabled = true;
        });
    }

    if (overlay) {
        overlay.classList.add('fade-out');
    }
}

// Lógica do botão Mudo / Desmudo = DANTAS
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

// Atualizar ícone conforme o slider = DANTAS
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

// Sincronizar slider com volume inicial do vídeo = DANTAS
if (video && volumeSlider) {
    video.volume = volumeSlider.value / 100;
    video.muted = true;
}

// Garantir que o vídeo tente carregar = DANTAS
if (video) {
    video.load();
}

// ========== SISTEMA DE DETECÇÃO DE LIVE DA TWITCH ========== = DANTAS

const TWITCH_CONFIG = {
    clientId: 'qz8pavotji46j4rwmmlkq05jp73wgn',
    accessToken: '970ipomt0lufbjca78a9l8i9oxh5mn',
    channelName: 'dantasfps1',
    gameImage: 'assets/images/capital.png',
    gameName: '[+18] Dantas policia civil - Capital City'
};

// Cache para não fazer muitas requisições = DANTAS
let liveCache = {
    isLive: false,
    lastCheck: 0,
    viewerCount: 0,
    title: ''
};

// Função para verificar status na Twitch = DANTAS
async function checkTwitchLive() {
    const now = Date.now();
    
    // Verificar cache (a cada 60 segundos) = DANTAS
    if (liveCache.lastCheck && (now - liveCache.lastCheck) < 60000) {
        return liveCache;
    }
    
    try {
        const response = await fetch(`https://api.twitch.tv/helix/streams?user_login=${TWITCH_CONFIG.channelName}`, {
            headers: {
                'Client-ID': TWITCH_CONFIG.clientId,
                'Authorization': `Bearer ${TWITCH_CONFIG.accessToken}`
            }
        });
        
        const data = await response.json();
        const isLive = data.data && data.data.length > 0;
        const stream = data.data[0];
        
        liveCache = {
            isLive: isLive,
            lastCheck: now,
            viewerCount: isLive ? stream.viewer_count : 0,
            title: isLive ? stream.title : TWITCH_CONFIG.gameName
        };
        
        return liveCache;
    } catch (error) {
        console.log('Erro ao verificar live:', error);
        return liveCache;
    }
}

// Função para atualizar a interface da live = DANTAS
async function updateLiveUI() {
    const status = await checkTwitchLive();
    
    const liveStatusDiv = document.getElementById('live-status');
    const liveDot = document.getElementById('live-dot');
    const liveText = document.getElementById('live-text');
    const watchButton = document.getElementById('watch-button');
    
    if (!liveStatusDiv) return;
    
    if (status.isLive) {
        // AO VIVO = DANTAS
        liveStatusDiv.classList.remove('offline');
        liveStatusDiv.classList.add('live');
        liveText.textContent = 'AO VIVO';
        watchButton.textContent = 'Assistir';
        watchButton.href = `https://twitch.tv/${TWITCH_CONFIG.channelName}`;
    } else {
        // OFFLINE = DANTAS
        liveStatusDiv.classList.remove('live');
        liveStatusDiv.classList.add('offline');
        liveText.textContent = 'OFFLINE';
        watchButton.textContent = 'Assistir';
        watchButton.href = `https://twitch.tv/${TWITCH_CONFIG.channelName}`;
    }
}

// Iniciar verificação de live = DANTAS
function startLiveChecker() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateLiveUI();
            setInterval(updateLiveUI, 60000);
        });
    } else {
        updateLiveUI();
        setInterval(updateLiveUI, 60000);
    }
}

// Iniciar o sistema de live = DANTAS
startLiveChecker();
