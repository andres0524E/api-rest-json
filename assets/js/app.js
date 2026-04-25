import { animeapi } from './api.js';
import { ui } from './ui.js';
import { getip } from './ip.js';

const api = new animeapi();
const UI = new ui();

let currentid = null;

document.addEventListener("DOMContentLoaded", async () => {

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
  });

  document.getElementById("animeGrid").addEventListener("click", async (e) => {
    const card = e.target.closest(".anime-card");
    if (!card) return;

    currentid = card.dataset.id;

    const data = await api.getanime(currentid);
    UI.showanime(data);
  });

  // 🔥 BOTÓN DE IDIOMA
  langbtn.addEventListener("click", async () => {
    UI.togglelang();

    if (currentid) {
      const data = await api.getanime(currentid);
      UI.showanime(data);
    }
  });

  select.dispatchEvent(new Event("change"));

  getip();
});