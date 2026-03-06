let gamesData = [];
let searchQuery = '';
let selectedGame = null;
let isFullscreen = false;

const mainContent = document.getElementById('main-content');
const searchInput = document.getElementById('search-input');
const logo = document.getElementById('logo');

async function init() {
    try {
        const response = await fetch('src/games.json');
        gamesData = await response.json();
        render();
    } catch (error) {
        console.error('Failed to load games:', error);
        mainContent.innerHTML = `<div class="text-center py-20 text-red-500">Failed to load games data.</div>`;
    }
}

function render() {
    if (selectedGame) {
        renderPlayer();
    } else {
        renderGrid();
    }
    lucide.createIcons();
}

function renderGrid() {
    const filteredGames = gamesData.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    let html = `
        <div class="space-y-8 animate-in fade-in duration-500">
            <!-- Hero Section -->
            <section class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 p-8 md:p-12">
                <div class="relative z-10 max-w-2xl">
                    <span class="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4">
                        Featured Game
                    </span>
                    <h2 class="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                        Dive into the <br />Ultimate Arcade
                    </h2>
                    <p class="text-indigo-100 text-lg mb-8 opacity-90">
                        Play the best unblocked games right in your browser. No downloads, no blocks, just pure fun.
                    </p>
                    <button 
                        onclick="window.handleGameSelect('${gamesData[0].id}')"
                        class="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-xl"
                    >
                        Play Now
                    </button>
                </div>
                <div class="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
                    <img 
                        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800"
                        alt="Gaming"
                        class="w-full h-full object-cover opacity-50 mix-blend-overlay"
                        referrerpolicy="no-referrer"
                    />
                    <div class="absolute inset-0 bg-gradient-to-l from-transparent to-indigo-600/50"></div>
                </div>
            </section>

            <!-- Games Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                ${filteredGames.map((game, index) => `
                    <div
                        onclick="window.handleGameSelect('${game.id}')"
                        class="group cursor-pointer animate-in slide-in-from-bottom-4 duration-500"
                        style="animation-delay: ${index * 50}ms"
                    >
                        <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-indigo-500/50 transition-all duration-300">
                            <img
                                src="${game.thumbnail}"
                                alt="${game.title}"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                referrerpolicy="no-referrer"
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <button class="w-full py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm shadow-lg">
                                    Play Now
                                </button>
                            </div>
                        </div>
                        <div class="mt-3">
                            <h3 class="font-bold text-zinc-100 group-hover:text-indigo-400 transition-colors">
                                ${game.title}
                            </h3>
                            <p class="text-xs text-zinc-500 line-clamp-1 mt-1">
                                ${game.description}
                            </p>
                        </div>
                    </div>
                `).join('')}
            </div>

            ${filteredGames.length === 0 ? `
                <div class="text-center py-20">
                    <div class="inline-block p-4 rounded-full bg-white/5 mb-4">
                        <i data-lucide="search" class="w-8 h-8 text-zinc-600"></i>
                    </div>
                    <h3 class="text-xl font-bold text-zinc-400">No games found</h3>
                    <p class="text-zinc-600">Try searching for something else</p>
                </div>
            ` : ''}
        </div>
    `;
    mainContent.innerHTML = html;
}

function renderPlayer() {
    const html = `
        <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <!-- Game Player Header -->
            <div class="flex items-center justify-between">
                <button
                    onclick="window.setSelectedGame(null)"
                    class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
                >
                    <i data-lucide="chevron-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform"></i>
                    <span>Back to Library</span>
                </button>
                <div class="flex items-center gap-2">
                    <button
                        onclick="window.toggleFullscreen()"
                        class="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        title="Toggle Fullscreen"
                    >
                        <i data-lucide="maximize-2" class="w-5 h-5"></i>
                    </button>
                    <a
                        href="${selectedGame.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        title="Open in New Tab"
                    >
                        <i data-lucide="external-link" class="w-5 h-5"></i>
                    </a>
                </div>
            </div>

            <!-- Iframe Container -->
            <div 
                id="game-container"
                class="relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 aspect-video w-full"
            >
                <iframe
                    src="${selectedGame.url}"
                    class="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    title="${selectedGame.title}"
                ></iframe>
            </div>

            <!-- Game Info -->
            <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h2 class="text-2xl font-bold mb-2">${selectedGame.title}</h2>
                <p class="text-zinc-400 leading-relaxed">${selectedGame.description}</p>
            </div>
        </div>
    `;
    mainContent.innerHTML = html;
}

// Global handlers
window.handleGameSelect = (id) => {
    selectedGame = gamesData.find(g => g.id === id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    render();
};

window.setSelectedGame = (val) => {
    selectedGame = val;
    render();
};

window.toggleFullscreen = () => {
    const container = document.getElementById('game-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
};

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (!selectedGame) {
        renderGrid();
        lucide.createIcons();
    }
});

logo.addEventListener('click', () => {
    selectedGame = null;
    render();
});

init();
