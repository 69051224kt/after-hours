const songs = [
  {id:"01",title:"Blue Hour",artist:"Mira Sol",mood:"Late Night",description:"Streetlights blur while the city finally exhales.",art:["#e56845","#54221e","#1a1415"],word:"2:17 AM"},
  {id:"02",title:"Soft Exit",artist:"The Quiet Club",mood:"Heartbreak",description:"For leaving gently, even when it still hurts.",art:["#91a4ad","#3b4a50","#151b20"],word:"SOFT EXIT"},
  {id:"03",title:"Nothing Personal",artist:"Vanta Bloom",mood:"No Feelings",description:"Cool head. Clear eyes. Keep moving forward.",art:["#98a788","#3d4636","#171b16"],word:"N / P"},
  {id:"04",title:"Velvet Rope",artist:"Saint Holiday",mood:"Main Character",description:"Walk in like the scene was written for you.",art:["#eba95f","#773b2d","#231718"],word:"SCENE 01"},
  {id:"05",title:"Window Seat",artist:"June Static",mood:"Late Night",description:"A slow ride home with nowhere to be.",art:["#7e88c4","#38334f","#171722"],word:"NO SIGNAL"},
  {id:"06",title:"Almost, Always",artist:"Iris West",mood:"Heartbreak",description:"The version of us that never made it out.",art:["#de8290","#63333f","#21161c"],word:"ALMOST"},
  {id:"07",title:"Chrome Heart",artist:"Low Season",mood:"No Feelings",description:"A little distance looks good on you tonight.",art:["#b6b4aa","#57544e","#1d1d1b"],word:"CHROME"},
  {id:"08",title:"Exit in Gold",artist:"Arden Grey",mood:"Main Character",description:"Take the long way. Let them wonder.",art:["#e6bd64","#795226","#241b13"],word:"FINALE"}
];

const grid = document.querySelector("#song-grid");
const emptyState = document.querySelector("#empty-state");
const count = document.querySelector("#track-count");
const resultsLabel = document.querySelector("#results-label");
const navCount = document.querySelector("#nav-count");
const filters = [...document.querySelectorAll(".mood-filter")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const favoriteKey = "after-hours-favorites";
let favorites = loadFavorites();
let activeMood = "All";
let activeView = "home";

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoriteKey) || "[]");
    return Array.isArray(saved) ? saved.filter(id => songs.some(song => song.id === id)) : [];
  } catch {
    return [];
  }
}

function saveFavorites() {
  try { localStorage.setItem(favoriteKey, JSON.stringify(favorites)); }
  catch { /* The page remains usable if storage is unavailable. */ }
}

function getVisibleSongs() {
  let visible = songs.filter(song => activeMood === "All" || song.mood === activeMood);
  if (activeView === "favorites") visible = visible.filter(song => favorites.includes(song.id));
  return visible;
}

function render() {
  const visible = getVisibleSongs();
  grid.innerHTML = visible.map((song, index) => {
    const isFavorite = favorites.includes(song.id);
    return `<article class="song-card" style="animation-delay:${index * 45}ms">
      <div class="album-art" style="--art-light:${song.art[0]};--art-mid:${song.art[1]};--art-dark:${song.art[2]}">
        <span class="album-index">AH / ${song.id}</span><span class="album-shape" aria-hidden="true"></span><span class="album-word">${song.word}</span>
        <button class="favorite-button${isFavorite ? " is-favorite" : ""}" type="button" data-favorite="${song.id}" aria-label="${isFavorite ? "Remove" : "Add"} ${song.title} ${isFavorite ? "from" : "to"} favorites" aria-pressed="${isFavorite}">${isFavorite ? "♥" : "♡"}</button>
      </div>
      <div class="card-info"><div class="card-top"><h3>${song.title}</h3><span class="mood-tag">${song.mood}</span></div><p class="artist">${song.artist}</p><p class="description">${song.description}</p></div>
    </article>`;
  }).join("");
  grid.hidden = visible.length === 0;
  emptyState.hidden = visible.length !== 0;
  count.textContent = `${String(visible.length).padStart(2, "0")} TRACK${visible.length === 1 ? "" : "S"}`;
  navCount.textContent = favorites.length;
  if (activeView === "favorites") resultsLabel.textContent = "SAVED FOR LATER";
  else if (activeMood === "All") resultsLabel.textContent = "THE FULL FREQUENCY";
  else resultsLabel.textContent = `TUNED TO ${activeMood.toUpperCase()}`;
}

filters.forEach(button => button.addEventListener("click", () => {
  activeMood = button.dataset.mood;
  filters.forEach(filter => {
    const selected = filter === button;
    filter.classList.toggle("selected", selected);
    filter.setAttribute("aria-pressed", String(selected));
  });
  render();
}));

grid.addEventListener("click", event => {
  const button = event.target.closest("[data-favorite]");
  if (!button) return;
  const id = button.dataset.favorite;
  favorites = favorites.includes(id) ? favorites.filter(favorite => favorite !== id) : [...favorites, id];
  saveFavorites();
  render();
});

navLinks.forEach(link => link.addEventListener("click", () => {
  activeView = link.dataset.view === "favorites" ? "favorites" : link.dataset.view;
  navLinks.forEach(item => item.classList.toggle("active", item === link));
  if (activeView !== "favorites") activeMood = "All";
  filters.forEach(filter => {
    const selected = filter.dataset.mood === activeMood;
    filter.classList.toggle("selected", selected);
    filter.setAttribute("aria-pressed", String(selected));
  });
  render();
}));

document.querySelector("#reset-filter").addEventListener("click", () => {
  activeView = "discover";
  activeMood = "All";
  navLinks.forEach(link => link.classList.toggle("active", link.dataset.view === "discover"));
  filters.forEach(filter => {
    const selected = filter.dataset.mood === "All";
    filter.classList.toggle("selected", selected);
    filter.setAttribute("aria-pressed", String(selected));
  });
  render();
});

render();
