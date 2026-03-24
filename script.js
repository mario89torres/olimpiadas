const tracks = [
    {
        id: 0,
        name: "Águilas",
        house: "Team Águilas",
        file: "Aguilas.mp3",
        icon: "bird",
        color: "#f59e0b"
    },
    {
        id: 1,
        name: "Caimanes",
        house: "Team Caimanes",
        file: "Caimanes x Caimanes x Caimanes (M… x Caimanes x Caimanes x Caimanes (M… (Mashup).mp3",
        icon: "droplets",
        color: "#10b981"
    },
    {
        id: 2,
        name: "Guacamayas",
        house: "Team Guacamayas",
        file: "guaca x guacamayas (Mashup).mp3",
        icon: "feather",
        color: "#ef4444"
    },
    {
        id: 3,
        name: "Jaguares",
        house: "Team Jaguares",
        file: "Jaguarers x Jaguares (Mashup).mp3",
        icon: "cat",
        color: "#fbbf24"
    },
    {
        id: 4,
        name: "Lobos",
        house: "Team Lobos",
        file: "lobos x lobos (Mashup).mp3",
        icon: "dog",
        color: "#64748b"
    },
    {
        id: 5,
        name: "Quetzales",
        house: "Team Quetzales",
        file: "quetzales x quetzales (Mashup).mp3",
        icon: "wind",
        color: "#22c55e"
    },
    {
        id: 6,
        name: "Serpientes",
        house: "Team Serpientes",
        file: "Serpientes x Serpientes (Mashup).mp3",
        icon: "zap",
        color: "#8b5cf6"
    },
    {
        id: 7,
        name: "Xolos",
        house: "Team Xolos",
        file: "Xolos x Xols (Mashup).mp3",
        icon: "skull",
        color: "#475569"
    },
    {
        id: 8,
        name: "Himno Innova",
        house: "Olimpiadas General",
        file: "innovaOlimpiadas.mp3",
        icon: "trophy",
        color: "#FFCD00"
    }
];

let currentIndex = 0;
let isPlaying = false;
let rotation = 0;

const audio = document.getElementById('audio-player');
const mainDial = document.getElementById('main-dial');
const sidebarList = document.getElementById('sidebar-list');
const playPauseBtn = document.getElementById('play-pause-btn');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const progressFill = document.getElementById('progress-fill');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('total-duration');
const coreArtContainer = document.querySelector('.album-art-container');
const trackNameEl = document.getElementById('current-track-name');
const trackHouseEl = document.getElementById('current-track-house');

function init() {
    renderSidebar();
    renderDial();
    loadTrack(0);
}

function renderSidebar() {
    sidebarList.innerHTML = tracks.map((track, index) => `
        <div class="track-item ${index === currentIndex ? 'active' : ''}" onclick="selectTrack(${index})">
            <div class="thumb-icon" style="background: ${track.color}22; color: ${track.color}">
                <i data-lucide="${track.icon}"></i>
            </div>
            <div class="track-details">
                <h4>${track.name}</h4>
                <p>${track.house}</p>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

function renderDial() {
    const angleStep = 360 / tracks.length;
    
    // Get radius from CSS variable
    const style = getComputedStyle(document.documentElement);
    const radius = parseInt(style.getPropertyValue('--radius').replace('px', '')) || 220;

    mainDial.innerHTML = tracks.map((track, index) => {
        const angle = index * angleStep;
        const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
        const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
        
        return `
            <div class="segment ${index === currentIndex ? 'active' : ''}" 
                 style="transform: translate(${x}px, ${y}px)"
                 onclick="selectTrack(${index})">
                <div class="segment-content">
                    <div class="seg-icon" style="color: ${track.color}">
                        <i data-lucide="${track.icon}"></i>
                    </div>
                    <h5>${track.name}</h5>
                </div>
            </div>
        `;
    }).join('');
    lucide.createIcons();
}

function loadTrack(index) {
    currentIndex = index;
    const track = tracks[index];
    audio.src = track.file;
    
    coreArtContainer.innerHTML = `
        <div class="art-glow" style="background: ${track.color}"></div>
        <div class="core-icon-circle" style="border-color: ${track.color}">
            <i data-lucide="${track.icon}" style="color: ${track.color};"></i>
        </div>
    `;
    
    trackNameEl.innerText = track.name;
    trackHouseEl.innerText = track.house;
    
    document.querySelectorAll('.track-item').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });
    document.querySelectorAll('.segment').forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });

    const angleStep = 360 / tracks.length;
    rotation = -index * angleStep;
    document.getElementById('dial-container').style.transform = `rotate(${rotation}deg)`;
    
    document.querySelectorAll('.segment-content').forEach(content => {
        content.style.transform = `translate(-50%, -50%) rotate(${-rotation}deg)`;
    });

    lucide.createIcons();
    if (isPlaying) audio.play();
}

function selectTrack(index) {
    loadTrack(index);
    if (!isPlaying) togglePlay();
    else audio.play();
}

function togglePlay() {
    if (isPlaying) {
        audio.pause();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    } else {
        audio.play();
        playIcon.classList.remove('hidden');
        pauseIcon.classList.remove('hidden');
    }
    isPlaying = !isPlaying;
}

playPauseBtn.onclick = togglePlay;

document.getElementById('next-btn').onclick = () => {
    selectTrack((currentIndex + 1) % tracks.length);
};

document.getElementById('prev-btn').onclick = () => {
    selectTrack((currentIndex - 1 + tracks.length) % tracks.length);
};

audio.ontimeupdate = () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progress}%`;
    currentTimeEl.innerText = formatTime(audio.currentTime);
};

audio.onloadedmetadata = () => {
    durationEl.innerText = formatTime(audio.duration);
};

audio.onended = () => {
    selectTrack((currentIndex + 1) % tracks.length);
};

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

document.getElementById('progress-bar').onclick = (e) => {
    const width = e.currentTarget.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
};

// Handle window resize to adjust circular layout
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        renderDial();
        loadTrack(currentIndex);
    }, 250);
});

init();
