import { animeapi } from './api.js';
import { ui } from './ui.js';
import { getip } from './ip.js';

const api = new animeapi();
const UI = new ui();

let currentid = null;

// ===== PARTICLE SYSTEM =====
function initParticles() {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    dx: (Math.random() - 0.5) * 0.3,
    dy: -Math.random() * 0.4 - 0.1,
    alpha: Math.random() * 0.5 + 0.1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230, 57, 70, ${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.y < 0) { p.y = canvas.height; p.x = Math.random() * canvas.width; }
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", async () => {
  initParticles();

  const select = document.getElementById("animeSelect");
  const langbtn = document.getElementById("langBtn");

  UI.showloader();

  const top = await api.gettopanime();

  UI.loadselect(top.data);
  UI.rendergrid(top.data);

  UI.hideloader();

  select.addEventListener("change", async () => {
    currentid = select.value;
    const data = await api.getanime(currentid);
    UI.showanime(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  document.getElementById("animeGrid").addEventListener("click", async (e) => {
    const card = e.target.closest(".anime-card");
    if (!card) return;

    currentid = card.dataset.id;

    // Update select to match
    const selectEl = document.getElementById("animeSelect");
    if (selectEl) selectEl.value = currentid;

    const data = await api.getanime(currentid);
    UI.showanime(data);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  langbtn.addEventListener("click", async () => {
    UI.togglelang();

    const heroSub = document.getElementById("heroSub");
    const exploreTitle = document.getElementById("exploreTitle");
    if (heroSub) heroSub.textContent = UI.lang === "es" ? "Selecciona un anime para explorar" : "Select an anime to explore";
    if (exploreTitle) exploreTitle.textContent = UI.lang === "es" ? "Explorar Animes" : "Explore Anime";

    if (currentid) {
      const data = await api.getanime(currentid);
      UI.showanime(data);
    }
  });

  select.dispatchEvent(new Event("change"));

  getip();
});
