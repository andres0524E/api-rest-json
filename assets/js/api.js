export class animeapi {
  constructor() {
    this.baseurl = "https://api.jikan.moe/v4";
  }

  async gettopanime() {
    const res = await fetch(`${this.baseurl}/top/anime`);
    return await res.json();
  }

  async getanime(id) {
    const res = await fetch(`${this.baseurl}/anime/${id}`);
    return await res.json();
  }
}