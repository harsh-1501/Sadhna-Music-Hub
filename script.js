/* ========================================================
   SADHNA MUSIC HUB – PREMIUM EDITION
   Made with ❤️ by Sadhna
   
   Features:
   ✓ Advanced Audio Engine with Web Audio API
   ✓ Real-time Frequency Visualizer
   ✓ 5-Band Equalizer
   ✓ Dynamic Playlist Management
   ✓ Offline Support
   ✓ WhatsApp Sharing
   ✓ Download Songs
   ✓ Animated UI
======================================================== */

/* SONG LIST — matches your REAL filenames */
const songs = [
  { title: "Apsara", artist: "Shreya Karmakar", src: "Apsara(KoshalWorld.Com).mp3" },
  { title: "Dil Jhoom", artist: "Vishal Mishra, Shreya Ghosal", src: "Dil Jhoom (Crakk)-(Mr-Jat.in).mp3" },
  { title: "Ghoonghat Ki Aadh Se", artist: "Kumar Sanu, Alka Yagnik", src: "Ghoonghat Ki Aadh Se Hum Hain Rahi Pyar Ke 128 Kbps.mp3" },
  { title: "Ishq Hai", artist: "Anurag Saikia, Varun Jain", src: "Ishq Hai(KoshalWorld.Com).mp3" },
  { title: "Jeena Haraam", artist: "Vishal Mishra", src: "Jeena Haraam (Crakk)-(Mr-Jat.in).mp3" },
  { title: "Kaabil Hoon", artist: "Jubin Nautiyal, Palak Muchchhal", src: "Kaabil Hoon Jubin Nautiyal 128 Kbps.mp3" },
  { title: "Kaise Hua", artist: "Vishal Mishra", src: "Kaise Hua - Kabir Singh-(Mr-Jat.in).mp3" },
  { title: "O Rangrez", artist: "Shankar Ehsan Loy, Shreya Ghoshal", src: "O Rangrez(KoshalWorld.Com).mp3" },
  { title: "Tere Bina Na Guzara", artist: "Josh Brar", src: "Tere Bina Na Guzara(KoshalWorld.Com).mp3" },
  { title: "Teri Aankhon Mein", artist: "Darshan Raval, Neha Kakkar", src: "Teri Aankhon Mein(KoshalWorld.Com).mp3" },
  { title: "Tu Jaane Na", artist: "Atif Aslam", src: "Tu Jaane Na-(Mr-Jat.in).mp3" },
  { title: "Tum Ho Toh", artist: "Vishal Mishra", src: "Tum Ho Toh Saiyaara 128 Kbps.mp3" },
  { title: "Tune Zindagi Mein", artist: "Udit Narayan", src: "Tune Zindagi Mein(KoshalWorld.Com).mp3" },
  { title: "O Re Piya", artist: "Atif Aslam", src: "Atif_Aslam_-_O_Re_Piya_(mp3.pm).mp3" },
  { title: "Ek Pal Ka Jeena - Mashup by Khudgharz", artist: "Khudgharz Band", src: "Ek Pal Ka Jeena _ Samjho Na _ Tauba Tauba _ Wishes _ 9_45 _ KHUDGHARZ(MP3_160K).mp3" },
  { title: "Tenu Na Bol Pawaan", artist: "Amjad Nadeem", src: "Tenu Na Bol Pawaan - Behen Hogi Teri _ Shruti Haasan_Raj Kummar Rao _ Amjad Nadeem(MP3_160K).mp3" },
  { title: "Sajjan Raazi", artist: "Satindar Sartaaj", src: "Sajjan Raazi(MP3_160K).mp3" },
  { title: "Tera Yaar Hoon Main", artist: "Priyansh Music", src: "Tera Yaar Hoon Mein Acoustic Cover...🎧.mp3" },
  { title: "Perfect", artist: "Ed Sheeran", src: "Ed Sheeran - Perfect(MP3_160K).mp3" },
  { title: "Tumse behtar", artist: "Harsh", src: "Tumse behtar cover song.mp3" },
  { title: "Teen Baan Ke Dhaari", artist: "Chhotu Ravana", src: "Teen Baan Ke Dhaari.mp3" }, 
  { title: "Bol Do Na Zara", artist: "Arman Malik", src: "Bol Do Na Zara.mp3" },
  { title: "Kabhi Jo Badal Barse", artist: "Arijit Singh", src: "Kabhi Jo Badal Barse.mp3" },
  { title: "Tere Bin", artist: "Shergill", src: "Tere Bin(MP3_160K).mp3" }
];

/* Elements */
const audio = document.getElementById("audioPlayer");
const playBtn = document.getElementById("playBtn");
const playIcon = document.querySelector(".play-icon");
const pauseIcon = document.querySelector(".pause-icon");

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");

const playlistItems = document.getElementById("playlistItems");
const playlistCount = document.getElementById("playlistCount");

const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");

const miniTitle = document.getElementById("miniTitle");
const miniArtist = document.getElementById("miniArtist");
const miniArt = document.getElementById("miniArt");
const miniPlay = document.getElementById("miniPlay")
const miniPrev = document.getElementById("miniPrev");
const miniNext = document.getElementById("miniNext");

const progressFill = document.getElementById("progressFill");
const progressInput = document.getElementById("progressInput");
const currentTimeEl = document.getElementById("currentTime");
const totalTimeEl = document.getElementById("totalTime");

const volumeSlider = document.getElementById("volumeSlider");
const downloadBtn = document.getElementById("downloadSong");
const shareBtn = document.getElementById("shareSong");
const searchBox = document.getElementById("searchBox");
const albumArt = document.getElementById("albumArt");
const eqResetBtn = document.getElementById("eqReset");
const eqSaveBtn = document.getElementById("eqSave");
const loadingOverlay = document.getElementById("loadingOverlay");
const toast = document.getElementById("toast");

let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;
let filteredSongs = [...songs];

let audioCtx = null;
let analyser = null;
let sourceNode = null;
let dataArray = null;
let filters = [];

/* -------------------------------------------------------
   UTILITY FUNCTIONS
-------------------------------------------------------- */
function showToast(message, duration = 3000) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}

function unlockAudio() {
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

/* -------------------------------------------------------
   AUDIO ENGINE + VISUALIZER + EQ
-------------------------------------------------------- */
function initAudioEngine() {
  if (audioCtx) return;

  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    sourceNode = audioCtx.createMediaElementSource(audio);

    /* EQ BANDS */
    const bands = [
      { f: 60, type: "lowshelf" },
      { f: 250, type: "peaking" },
      { f: 1000, type: "peaking" },
      { f: 4000, type: "peaking" },
      { f: 10000, type: "highshelf" }
    ];

    filters = bands.map((b) => {
      const f = audioCtx.createBiquadFilter();
      f.type = b.type;
      f.frequency.value = b.f;
      f.gain.value = 0;
      return f;
    });

    /* CHAIN FILTERS */
    sourceNode.connect(filters[0]);
    filters[0].connect(filters[1]);
    filters[1].connect(filters[2]);
    filters[2].connect(filters[3]);
    filters[3].connect(filters[4]);
    filters[4].connect(analyser);
    analyser.connect(audioCtx.destination);

    /* EQ SLIDERS */
    ["eq0", "eq1", "eq2", "eq3", "eq4"].forEach((id, i) => {
      const slider = document.getElementById(id);
      const output = document.getElementById(id + "Val");
      slider.addEventListener("input", (e) => {
        filters[i].gain.value = Number(e.target.value);
        output.textContent = e.target.value + " dB";
      });
    });

    drawVisualizer();
    console.log("Audio engine initialized successfully");
  } catch (err) {
    console.error("Failed to initialize audio engine:", err);
    showToast("Audio engine initialization failed. Visualizer may not work.");
  }
}

/* Auto-init on first play attempt */
audio.addEventListener("play", () => {
  if (!audioCtx) initAudioEngine();
}, { once: true });

/* Create animated equalizer bars */
function createEqualizerBars() {
  const equalizer = document.getElementById("equalizer");
  equalizer.innerHTML = "";
  
  for (let i = 0; i < 32; i++) {
    const bar = document.createElement("div");
    bar.className = "bar";
    equalizer.appendChild(bar);
  }
}

/* Animate equalizer bars */
function animateEqualizer() {
  if (!analyser || audio.paused) {
    document.querySelectorAll(".equalizer .bar").forEach(bar => {
      bar.style.height = "8px";
    });
    return;
  }
  
  const bars = document.querySelectorAll(".equalizer .bar");
  analyser.getByteFrequencyData(dataArray);
  
  bars.forEach((bar, i) => {
    const index = Math.floor(i * dataArray.length / bars.length);
    const value = dataArray[index];
    const height = (value / 255) * 48;
    bar.style.height = Math.max(8, height) + "px";
  });
  
  requestAnimationFrame(animateEqualizer);
}

/* -------------------------------------------------------
   VISUALIZER
-------------------------------------------------------- */
function drawVisualizer() {
  requestAnimationFrame(drawVisualizer);

  if (!analyser) return;

  const canvas = document.getElementById("visualizer");
  const ctx = canvas.getContext("2d");

  canvas.width = canvas.offsetWidth;
  canvas.height = 100;

  const w = canvas.width;
  const h = canvas.height;

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, w, h);

  const barWidth = (w / dataArray.length) * 1.3;
  let x = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const v = dataArray[i] / 255;
    const barHeight = v * h;

    ctx.fillStyle = `hsl(${180 - v * 120}, 80%, 60%)`;
    ctx.fillRect(x, h - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}

/* -------------------------------------------------------
   LOAD SONG
-------------------------------------------------------- */
function loadSong(i) {
  const s = songs[i];
  currentIndex = i;

  audio.src = s.src;
  audio.load();

  songTitle.querySelector("span").textContent = s.title;
  songArtist.textContent = s.artist;

  document.getElementById("songTitleMini").querySelector("span").textContent = s.title;
  document.getElementById("songArtistMini").textContent = s.artist;

  document.getElementById("npTitle").textContent = s.title;
  document.getElementById("npArtist").textContent = s.artist;

  miniTitle.textContent = s.title;
  miniArtist.textContent = s.artist;
  miniArt.src = "Sd1811.png";
  albumArt.src = "Sd1811.png";

  highlightPlaylist();
}

/* -------------------------------------------------------
   PLAY / PAUSE
-------------------------------------------------------- */
function togglePlay() {
  if (!audioCtx) {
    initAudioEngine();
  }
  
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  
  if (audio.paused) {
    audio.play().then(() => {
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
      albumArt.classList.add("playing");
      animateEqualizer();
    }).catch(err => {
      console.error("Playback error:", err);
      showToast("Error playing audio. Please try again.");
    });
  } else {
    audio.pause();
    playIcon.classList.remove("hidden");
    pauseIcon.classList.add("hidden");
    albumArt.classList.remove("playing");
  }
}

playBtn.addEventListener("click", togglePlay);

/* Handle audio events */
audio.addEventListener("play", () => {
  playIcon.classList.add("hidden");
  pauseIcon.classList.remove("hidden");
  albumArt.classList.add("playing");
  animateEqualizer();
});

audio.addEventListener("pause", () => {
  playIcon.classList.remove("hidden");
  pauseIcon.classList.add("hidden");
  albumArt.classList.remove("playing");
});

audio.addEventListener("error", (e) => {
  console.error("Audio error:", e);
  showToast("Error loading audio file");
  loadingOverlay.classList.add("hidden");
});

audio.addEventListener("loadstart", () => {
  loadingOverlay.classList.remove("hidden");
});

audio.addEventListener("canplay", () => {
  loadingOverlay.classList.add("hidden");
});

/* MINIPLAYER CONTROLS */
miniPlay.onclick = () => playBtn.click();
miniPrev.onclick = () => prevBtn.click();
miniNext.onclick = () => nextBtn.click();

/* NEXT SONG */
nextBtn.addEventListener("click", () => {
  currentIndex = isShuffle
    ? Math.floor(Math.random() * songs.length)
    : (currentIndex + 1) % songs.length;

  loadSong(currentIndex);
  audio.play();
});

/* PREVIOUS SONG */
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
  audio.play();
});

/* SHUFFLE */
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
  showToast(isShuffle ? "Shuffle ON" : "Shuffle OFF");
});

/* REPEAT */
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
  showToast(isRepeat ? "Repeat ON" : "Repeat OFF");
});

/* AUTO NEXT */
audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextBtn.click();
  }
});

/* -------------------------------------------------------
   PROGRESS BAR + TIME
-------------------------------------------------------- */
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const pct = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = pct + "%";
  progressInput.value = pct;

  currentTimeEl.textContent = formatTime(audio.currentTime);
  totalTimeEl.textContent = formatTime(audio.duration);
});

progressInput.addEventListener("input", () => {
  audio.currentTime = (progressInput.value / 100) * audio.duration;
});

/* TIME FORMATTER */
function formatTime(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* -------------------------------------------------------
   VOLUME
-------------------------------------------------------- */
volumeSlider.addEventListener("input", (e) => {
  const vol = e.target.value / 100;
  audio.volume = vol;
  
  const volumeIcon = document.querySelector(".volume label");
  if (vol === 0) {
    volumeIcon.textContent = "🔇";
  } else if (vol < 0.5) {
    volumeIcon.textContent = "🔉";
  } else {
    volumeIcon.textContent = "🔊";
  }
});

/* -------------------------------------------------------
   SEARCH FUNCTIONALITY
-------------------------------------------------------- */
searchBox.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  
  if (query === "") {
    filteredSongs = [...songs];
  } else {
    filteredSongs = songs.filter(s => 
      s.title.toLowerCase().includes(query) || 
      s.artist.toLowerCase().includes(query)
    );
  }
  
  buildPlaylist();
  showToast(`Found ${filteredSongs.length} song${filteredSongs.length !== 1 ? 's' : ''}`);
});

/* -------------------------------------------------------
   DOWNLOAD SONG
-------------------------------------------------------- */
downloadBtn.addEventListener("click", () => {
  const currentSong = songs[currentIndex];
  const link = document.createElement("a");
  link.href = currentSong.src;
  link.download = currentSong.src;
  link.click();
  showToast(`Downloading: ${currentSong.title}`);
});

/* -------------------------------------------------------
   SHARE TO WHATSAPP
-------------------------------------------------------- */
shareBtn.addEventListener("click", () => {
  const currentSong = songs[currentIndex];
  const message = `🎵 Check out this amazing song: *${currentSong.title}* by ${currentSong.artist}\n\nPlaying on Sadhna Music Hub 🎶`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank");
  showToast("Opening WhatsApp...");
});

/* -------------------------------------------------------
   EQUALIZER CONTROLS
-------------------------------------------------------- */
eqResetBtn.addEventListener("click", () => {
  ["eq0", "eq1", "eq2", "eq3", "eq4"].forEach((id, i) => {
    const slider = document.getElementById(id);
    const output = document.getElementById(id + "Val");
    slider.value = 0;
    output.textContent = "0 dB";
    if (filters[i]) {
      filters[i].gain.value = 0;
    }
  });
  showToast("Equalizer Reset");
});

eqSaveBtn.addEventListener("click", () => {
  const eqSettings = {};
  ["eq0", "eq1", "eq2", "eq3", "eq4"].forEach(id => {
    eqSettings[id] = document.getElementById(id).value;
  });
  localStorage.setItem("sadhna_eq_settings", JSON.stringify(eqSettings));
  showToast("Equalizer Settings Saved!");
});

/* Load saved EQ settings */
function loadEQSettings() {
  const saved = localStorage.getItem("sadhna_eq_settings");
  if (saved) {
    const settings = JSON.parse(saved);
    Object.keys(settings).forEach((id, i) => {
      const slider = document.getElementById(id);
      const output = document.getElementById(id + "Val");
      if (slider) {
        slider.value = settings[id];
        output.textContent = settings[id] + " dB";
        if (filters[i]) {
          filters[i].gain.value = Number(settings[id]);
        }
      }
    });
  }
}

/* -------------------------------------------------------
   PLAYLIST
-------------------------------------------------------- */
function buildPlaylist() {
  playlistItems.innerHTML = "";
  playlistCount.textContent = filteredSongs.length + " song" + (filteredSongs.length !== 1 ? "s" : "");

  filteredSongs.forEach((s, displayIndex) => {
    const actualIndex = songs.indexOf(s);
    const div = document.createElement("div");
    div.className = "playlist-item";
    div.innerHTML = `
      <div class="meta">
        <span>${s.title}</span>
        <small>${s.artist}</small>
      </div>
      <span style="opacity:0.5;font-size:12px">${formatTime(0)}</span>
    `;

    div.addEventListener("click", () => {
      currentIndex = actualIndex;
      loadSong(actualIndex);
      audio.play();
    });

    playlistItems.appendChild(div);
  });
}

function highlightPlaylist() {
  document.querySelectorAll(".playlist-item").forEach((item, i) => {
    item.classList.toggle("playing-item", i === currentIndex);
  });
}

/* -------------------------------------------------------
   KEYBOARD SHORTCUTS
-------------------------------------------------------- */
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT") return;
  
  switch(e.key) {
    case " ":
      e.preventDefault();
      togglePlay();
      break;
    case "ArrowRight":
      nextBtn.click();
      break;
    case "ArrowLeft":
      prevBtn.click();
      break;
    case "ArrowUp":
      e.preventDefault();
      volumeSlider.value = Math.min(100, Number(volumeSlider.value) + 5);
      volumeSlider.dispatchEvent(new Event("input"));
      break;
    case "ArrowDown":
      e.preventDefault();
      volumeSlider.value = Math.max(0, Number(volumeSlider.value) - 5);
      volumeSlider.dispatchEvent(new Event("input"));
      break;
  }
});

/* -------------------------------------------------------
   SERVICE WORKER FOR OFFLINE SUPPORT
-------------------------------------------------------- */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").then(
      () => console.log("Service Worker registered"),
      (err) => console.log("Service Worker registration failed:", err)
    );
  });
}

/* -------------------------------------------------------
   INIT
-------------------------------------------------------- */
createEqualizerBars();
buildPlaylist();
loadSong(0);
audio.volume = 0.7;
volumeSlider.value = 70;

/* Load saved settings */
setTimeout(() => {
  loadEQSettings();
  loadingOverlay.classList.add("hidden");
}, 1000);

/* Welcome message */
setTimeout(() => {
  showToast("Welcome to Sadhna Music Hub! 🎵", 4000);
}, 1500);

/* -------------------------------------------------------
   END - Made with ❤️ by Sadhna
-------------------------------------------------------- */
