/**
 * စာအုပ်ဖတ်စက်
 * PDF Book Reader + Nara Mini TTS (via SagaPyaw)
 * Ready for GitHub Pages
 */

import * as pdfjsLib from "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

// ========== State ==========
const state = {
  pdf: null,
  pages: [],
  currentPage: 0,
  totalPages: 0,
  mode: "text",
  theme: localStorage.getItem("theme") || "light",
  fontSize: parseInt(localStorage.getItem("fontSize") || "18", 10),
  lineHeight: parseFloat(localStorage.getItem("lineHeight") || "1.7"),
  selectedVoice: localStorage.getItem("voice") || "shoon",
  isPlaying: false,
};

// ========== DOM helpers ==========
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const uploadScreen = $("#upload-screen");
const readerScreen = $("#reader-screen");
const dropZone = $("#drop-zone");
const pdfInput = $("#pdf-input");
const pageContent = $("#page-content");
const currentPageEl = $("#current-page");
const totalPagesEl = $("#total-pages");
const progressFill = $("#progress-fill");
const audioPanel = $("#audio-panel");
const ttsStatus = $("#tts-status");
const loadingOverlay = $("#loading-overlay");
const loadingText = $("#loading-text");

// ========== Theme & Typography ==========
function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  localStorage.setItem("theme", state.theme);
  const sel = $("#theme-select");
  if (sel) sel.value = state.theme;
}

function applyTypography() {
  pageContent.style.fontSize = state.fontSize + "px";
  pageContent.style.lineHeight = state.lineHeight;
  $("#font-size").value = state.fontSize;
  $("#font-size-val").textContent = state.fontSize + "px";
  $("#line-height").value = state.lineHeight;
  $("#line-height-val").textContent = state.lineHeight;
  localStorage.setItem("fontSize", state.fontSize);
  localStorage.setItem("lineHeight", state.lineHeight);
}

// ========== Loading UI ==========
function showLoading(msg = "လုပ်ဆောင်နေသည်...") {
  loadingText.textContent = msg;
  loadingOverlay.classList.remove("hidden");
}
function hideLoading() {
  loadingOverlay.classList.add("hidden");
}

// ========== PDF ==========
async function loadPdf(file) {
  try {
    showLoading("PDF ဖတ်နေသည်...");

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    state.pdf = pdf;
    state.totalPages = pdf.numPages;
    state.pages = [];
    state.currentPage = 0;

    for (let i = 1; i <= pdf.numPages; i++) {
      showLoading(`စာမျက်နှာ ${i} / ${pdf.numPages} ထုတ်ယူနေသည်...`);
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((it) => it.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      state.pages.push(text || `(စာမျက်နှာ ${i} — စာသား မတွေ့ပါ)`);
    }

    totalPagesEl.textContent = state.totalPages;
    showReader();
    renderPage();
  } catch (err) {
    console.error(err);
    alert("PDF ဖတ်ရာတွင် အမှားရှိနေသည်။\n" + (err.message || err));
  } finally {
    hideLoading();
  }
}

function renderPage() {
  if (!state.pages.length) return;

  pageContent.textContent = state.pages[state.currentPage] || "";
  currentPageEl.textContent = state.currentPage + 1;

  const pct = ((state.currentPage + 1) / state.totalPages) * 100;
  progressFill.style.width = pct + "%";

  $("#btn-prev").disabled = state.currentPage === 0;
  $("#btn-next").disabled = state.currentPage >= state.totalPages - 1;
}

function goToPage(delta) {
  const next = state.currentPage + delta;
  if (next < 0 || next >= state.totalPages) return;
  state.currentPage = next;
  renderPage();
  stopLocalTTS();
}

// ========== Mode ==========
function setMode(mode) {
  state.mode = mode;
  $$(".mode-btn").forEach((b) => {
    b.classList.toggle("active", b.id === "mode-" + mode);
  });
  if (mode === "audio") {
    audioPanel.classList.remove("hidden");
  } else {
    audioPanel.classList.add("hidden");
    stopLocalTTS();
  }
}

// ========== Voice selection ==========
function selectVoice(voice) {
  state.selectedVoice = voice;
  localStorage.setItem("voice", voice);
  $$(".voice-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.voice === voice);
  });
}

// ========== TTS ==========
/**
 * 1. Local fallback (Web Speech API) – works offline-ish, quality depends on browser
 * 2. "SagaPyaw မှာ ဖွင့်" – opens the real Nara Mini engine with current page text
 */

function stopLocalTTS() {
  state.isPlaying = false;
  if (window.speechSynthesis) speechSynthesis.cancel();
  $("#btn-stop").classList.add("hidden");
  $("#btn-play-page").disabled = false;
  ttsStatus.textContent = "";
}

function playCurrentPageLocal() {
  const text = state.pages[state.currentPage];
  if (!text || text.startsWith("(")) {
    ttsStatus.textContent = "ဒီစာမျက်နှာမှာ စာသား မရှိပါ";
    return;
  }

  if (!window.speechSynthesis) {
    ttsStatus.textContent = "Browser မှာ Speech Synthesis မရှိပါ။ SagaPyaw ကို သုံးပါ။";
    return;
  }

  stopLocalTTS();
  state.isPlaying = true;
  $("#btn-stop").classList.remove("hidden");
  $("#btn-play-page").disabled = true;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "my-MM";
  utter.rate = 0.92;

  // Try to pick a Burmese / Myanmar voice if available
  const voices = speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) =>
      v.lang.toLowerCase().startsWith("my") ||
      v.name.toLowerCase().includes("myanmar") ||
      v.name.toLowerCase().includes("burmese")
  );
  if (preferred) utter.voice = preferred;

  utter.onend = () => stopLocalTTS();
  utter.onerror = () => stopLocalTTS();

  ttsStatus.textContent = `ဖတ်နေသည်... (${state.selectedVoice} · browser voice)`;
  speechSynthesis.speak(utter);
}

/**
 * Open SagaPyaw (real Nara Mini) with current page text + selected voice
 * SagaPyaw supports ?text= and ?voice=
 */
function openInSagaPyaw() {
  const text = state.pages[state.currentPage];
  if (!text || text.startsWith("(")) {
    ttsStatus.textContent = "ဒီစာမျက်နှာမှာ စာသား မရှိပါ";
    return;
  }

  // Limit length a bit for URL safety (SagaPyaw can handle longer via other means)
  const safeText = text.slice(0, 1800);
  const url = new URL("https://sagapyaw.sagapyaw.workers.dev/");
  url.searchParams.set("text", safeText);
  url.searchParams.set("voice", state.selectedVoice);

  ttsStatus.textContent = "SagaPyaw ဖွင့်နေသည်...";
  window.open(url.toString(), "_blank", "noopener");
}

// ========== Screen switching ==========
function showReader() {
  uploadScreen.classList.remove("active");
  readerScreen.classList.add("active");
}
function showUpload() {
  stopLocalTTS();
  readerScreen.classList.remove("active");
  uploadScreen.classList.add("active");
  state.pdf = null;
  state.pages = [];
  pdfInput.value = "";
}

// ========== Events ==========
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer.files[0];
  if (file?.type === "application/pdf") loadPdf(file);
  else alert("PDF ဖိုင်သာ လက်ခံပါသည်");
});

$("#btn-select-pdf").addEventListener("click", () => pdfInput.click());
pdfInput.addEventListener("change", () => {
  const file = pdfInput.files[0];
  if (file) loadPdf(file);
});

$("#btn-prev").addEventListener("click", () => goToPage(-1));
$("#btn-next").addEventListener("click", () => goToPage(1));
$("#btn-back").addEventListener("click", showUpload);

$("#mode-text").addEventListener("click", () => setMode("text"));
$("#mode-audio").addEventListener("click", () => setMode("audio"));

$("#btn-play-page").addEventListener("click", playCurrentPageLocal);
$("#btn-open-sagapyaw").addEventListener("click", openInSagaPyaw);
$("#btn-stop").addEventListener("click", stopLocalTTS);

$$(".voice-btn").forEach((btn) => {
  btn.addEventListener("click", () => selectVoice(btn.dataset.voice));
});

$("#btn-theme").addEventListener("click", () => {
  const order = { light: "sepia", sepia: "dark", dark: "light" };
  state.theme = order[state.theme] || "light";
  applyTheme();
});

$("#btn-settings").addEventListener("click", () => {
  $("#settings-modal").classList.remove("hidden");
});
$("#btn-close-settings").addEventListener("click", () => {
  $("#settings-modal").classList.add("hidden");
});

$("#font-size").addEventListener("input", (e) => {
  state.fontSize = parseInt(e.target.value, 10);
  applyTypography();
});
$("#line-height").addEventListener("input", (e) => {
  state.lineHeight = parseFloat(e.target.value);
  applyTypography();
});
$("#theme-select").addEventListener("change", (e) => {
  state.theme = e.target.value;
  applyTheme();
});

document.addEventListener("keydown", (e) => {
  if (!readerScreen.classList.contains("active")) return;
  if (e.key === "ArrowLeft") goToPage(-1);
  if (e.key === "ArrowRight") goToPage(1);
  if (e.key === "Escape") showUpload();
});

$("#btn-fullscreen").addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
});

// Init
applyTheme();
applyTypography();
selectVoice(state.selectedVoice);

if (window.speechSynthesis) {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

console.log("စာအုပ်ဖတ်စက် ready");
