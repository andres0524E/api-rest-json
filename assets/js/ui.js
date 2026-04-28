export class ui {

  constructor() {
    this.lang = "es";
  }

  togglelang() {
    this.lang = this.lang === "es" ? "en" : "es";
    document.getElementById("langLabel").textContent = this.lang.toUpperCase();
  }

  showloader() {
    const loader = document.getElementById("loader");
    loader.classList.add("active");
  }

  hideloader() {
    const loader = document.getElementById("loader");
    loader.classList.remove("active");
  }

  loadselect(animes) {
    const select = document.getElementById("animeSelect");
    select.innerHTML = "";
    animes.forEach(anime => {
      const option = document.createElement("option");
      option.value = anime.mal_id;
      option.textContent = anime.title;
      select.appendChild(option);
    });
  }

  async traducir(texto) {
    if (this.lang === "en") return texto;
    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(texto)}`
      );
      const data = await res.json();
      return data[0].map(t => t[0]).join("");
    } catch {
      return texto;
    }
  }

  traducirgeneros(genres) {
    const mapa = {
      "Action": "Acción", "Adventure": "Aventura", "Comedy": "Comedia",
      "Drama": "Drama", "Fantasy": "Fantasía", "Horror": "Horror",
      "Romance": "Romance", "Sci-Fi": "Ciencia Ficción", "Slice of Life": "Vida Cotidiana",
      "Mystery": "Misterio", "Supernatural": "Sobrenatural", "Thriller": "Thriller",
      "Sports": "Deportes", "Music": "Música", "Historical": "Histórico"
    };
    if (this.lang === "en") return genres.map(g => g.name);
    return genres.map(g => mapa[g.name] || g.name);
  }

  traducirorigen(source) {
    const mapa = {
      "manga": "Manga 📖", "light novel": "Novela ligera 📚",
      "novel": "Novela 📘", "original": "Original 🎬", "game": "Videojuego 🎮"
    };
    if (this.lang === "en") return source;
    return mapa[source] || source;
  }

  rendergrid(animes) {
    const grid = document.getElementById("animeGrid");
    grid.innerHTML = animes.map((anime, i) => {
      const img =
        anime.images.webp?.large_image_url ||
        anime.images.jpg?.large_image_url;
      return `
        <div class="anime-card" data-id="${anime.mal_id}" style="animation-delay:${i * 0.04}s">
          <img src="${img}" alt="${anime.title}" loading="lazy">
          <div class="card-overlay">
            <div class="card-title">${anime.title}</div>
            ${anime.score ? `<div class="card-score">★ ${anime.score}</div>` : ''}
          </div>
        </div>
      `;
    }).join("");
  }

  setbackground(image) {
    document.getElementById("bgBlur").style.backgroundImage = `url(${image})`;
  }

  async showanime(anime) {
    const result = document.getElementById("result");
    const data = anime.data;

    const imagenAlta =
      data.images.webp?.large_image_url ||
      data.images.jpg?.large_image_url;

    this.setbackground(imagenAlta);
    this.showloader();

    const sinopsis = await this.traducir(data.synopsis || "Sin sinopsis disponible.");
    const generos = this.traducirgeneros(data.genres);
    const origen = this.traducirorigen(data.source);

    this.hideloader();

    const scoreLabel = this.lang === "es" ? "Puntuación" : "Score";
    const rankLabel = this.lang === "es" ? "Ranking" : "Rank";
    const epsLabel = this.lang === "es" ? "Episodios" : "Episodes";
    const sourceLabel = this.lang === "es" ? "Basado en" : "Source";
    const synopsisLabel = this.lang === "es" ? "Sinopsis" : "Synopsis";

    const generosTags = generos.map(g => `<span class="genre-tag">${g}</span>`).join("");

    result.innerHTML = `
      <div class="detail-card">
        <div class="detail-poster">
          <img src="${imagenAlta}" class="detail-img" alt="${data.title}">
          ${data.score ? `<div class="score-badge">★ ${data.score}</div>` : ''}
        </div>
        <div class="detail-info">
          <div class="detail-title">
            <span>${data.title_japanese || ''}</span>
            ${data.title}
          </div>

          <div class="detail-stats">
            ${data.rank ? `<div class="stat-chip"><span class="chip-label">${rankLabel}</span> #${data.rank}</div>` : ''}
            ${data.episodes ? `<div class="stat-chip"><span class="chip-label">${epsLabel}</span> ${data.episodes}</div>` : ''}
            ${data.status ? `<div class="stat-chip">${data.status}</div>` : ''}
            ${data.year ? `<div class="stat-chip">${data.year}</div>` : ''}
          </div>

          ${data.genres.length ? `<div class="genres">${generosTags}</div>` : ''}

          ${data.source ? `<div class="stat-chip" style="align-self:start"><span class="chip-label">${sourceLabel}</span> ${origen}</div>` : ''}

          <div class="detail-divider"></div>

          <div>
            <div class="synopsis-label">📖 ${synopsisLabel}</div>
            <p class="synopsis-text">${sinopsis}</p>
          </div>
        </div>
      </div>
    `;
  }
}
