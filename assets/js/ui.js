export class ui {

  constructor() {
    this.lang = "es";
  }

  togglelang() {
    this.lang = this.lang === "es" ? "en" : "es";
  }

  showloader() {
    document.getElementById("loader").style.display = "block";
  }

  hideloader() {
    document.getElementById("loader").style.display = "none";
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
      "Action": "Acción",
      "Adventure": "Aventura",
      "Comedy": "Comedia",
      "Drama": "Drama",
      "Fantasy": "Fantasía",
      "Horror": "Horror",
      "Romance": "Romance",
      "Sci-Fi": "Ciencia ficción",
      "Slice of Life": "Vida cotidiana"
    };

    if (this.lang === "en") return genres.map(g => g.name).join(", ");

    return genres.map(g => mapa[g.name] || g.name).join(", ");
  }

  traducirorigen(source) {
    const mapa = {
      "manga": "Manga 📖",
      "light novel": "Novela ligera 📚",
      "novel": "Novela 📘",
      "original": "Original 🎬",
      "game": "Videojuego 🎮"
    };

    if (this.lang === "en") return source;

    return mapa[source] || source;
  }

  rendergrid(animes) {
    const grid = document.getElementById("animeGrid");

    grid.innerHTML = animes.map(anime => {
      const img =
        anime.images.webp?.large_image_url ||
        anime.images.jpg?.large_image_url;

      return `
        <div class="anime-card" data-id="${anime.mal_id}">
          <img src="${img}">
          <div class="overlay">
            <h6>🎬 ${anime.title}</h6>
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

    const sinopsis = await this.traducir(data.synopsis || "");
    const generos = this.traducirgeneros(data.genres);
    const origen = this.traducirorigen(data.source);

    this.hideloader();

    result.innerHTML = `
      <div class="detail-card fade-in">

        <h2>🎬 ${data.title}</h2>

        <img src="${imagenAlta}" class="detail-img">

        <p>⭐ <strong>${this.lang === "es" ? "Calificación" : "Score"}:</strong> ${data.score || "N/A"}</p>
        <p>🏆 <strong>${this.lang === "es" ? "Ranking" : "Rank"}:</strong> ${data.rank || "N/A"}</p>
        <p>📺 <strong>${this.lang === "es" ? "Episodios" : "Episodes"}:</strong> ${data.episodes || "N/A"}</p>
        <p>🎭 <strong>${this.lang === "es" ? "Géneros" : "Genres"}:</strong> ${generos}</p>
        <p>📚 <strong>${this.lang === "es" ? "Basado en" : "Source"}:</strong> ${origen}</p>

        <hr>

        <p>📖 <strong>${this.lang === "es" ? "Sinopsis" : "Synopsis"}:</strong><br>${sinopsis}</p>

      </div>
    `;
  }
}