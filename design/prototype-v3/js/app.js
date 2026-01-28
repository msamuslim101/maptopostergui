// MapToPoster V3 Logic (Merged)

// FULL 10 THEME COLLECTION (V1 + V2)
const themes = [
    { id: 'noir', name: 'Noir', color: '#000000', style: 'dark' },
    { id: 'blueprint', name: 'Blueprint', color: '#1e3a8a', style: 'blue' },
    { id: 'sunset', name: 'Sunset', color: '#c2410c', style: 'orange' },
    { id: 'magma', name: 'Magma', color: '#1a1a1a', style: 'red' },
    { id: 'ocean', name: 'Ocean', color: '#0e7490', style: 'cyan' },
    { id: 'forest', name: 'Forest', color: '#14532d', style: 'green' },
    // V1 Additions
    { id: 'vintage', name: 'Vintage', color: '#d4c4a8', style: 'light' },
    { id: 'atlas', name: 'Atlas', color: '#e5e7eb', style: 'light' },
    { id: 'minimal', name: 'Minimal', color: '#ffffff', style: 'light' },
    { id: 'copper', name: 'Copper', color: '#78350f', style: 'brown' },
];

document.addEventListener('DOMContentLoaded', () => {

    // Elements
    const themeGrid = document.getElementById('theme-grid');
    const themeCount = document.getElementById('theme-count');
    const emptyState = document.getElementById('empty-state');
    const posterPreview = document.getElementById('poster-preview');
    const canvasBg = document.getElementById('canvas-bg');
    const previewMapLayer = document.getElementById('preview-map-layer');
    const previewCity = document.getElementById('preview-city');
    const btnExport = document.getElementById('btn-export');
    const modalOverlay = document.getElementById('modal-overlay');
    const zoomControls = document.getElementById('zoom-controls');
    const cityInput = document.getElementById('city-input');

    let selectedThemeId = null;

    // Initialize UI
    themeCount.textContent = `${themes.length} Available`;

    // Render Themes
    themes.forEach(theme => {
        const btn = document.createElement('button');
        btn.className = `group relative flex flex-col gap-2 p-1 rounded-xl transition-all border border-transparent hover:border-white/10 text-left theme-card`;
        btn.dataset.id = theme.id;

        // Inner HTML (V2 Style Card with JS generated icons)
        btn.innerHTML = `
            <div class="absolute top-2 right-2 bg-brand text-black rounded-full p-1 z-10 shadow-lg check-icon scale-0 transition-transform flex items-center justify-center">
                <i data-lucide="check" class="w-3 h-3 stroke-[3]"></i>
            </div>
            <div class="w-full aspect-square rounded-lg overflow-hidden relative shadow-inner transition-transform group-hover:scale-[1.02]" 
                 style="background-color: ${theme.color}">
                 <div class="absolute inset-0 opacity-30" style="background-image: linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.5) 48%, rgba(255,255,255,0.5) 52%, transparent 52%); background-size: 30px 30px;"></div>
            </div>
            <span class="text-sm font-medium text-txt-secondary group-hover:text-txt-primary px-1">${theme.name}</span>
        `;

        btn.onclick = () => selectTheme(theme.id);
        themeGrid.appendChild(btn);
    });

    // Refresh icons since we added them dynamically
    lucide.createIcons();

    // Theme Selection
    function selectTheme(id) {
        if (selectedThemeId === id) return;
        selectedThemeId = id;
        const theme = themes.find(t => t.id === id);

        // Update Theme Cards UI
        document.querySelectorAll('.theme-card').forEach(card => {
            const check = card.querySelector('.check-icon');
            if (card.dataset.id === id) {
                card.classList.add('ring-2', 'ring-brand', 'bg-brand/5');
                check.classList.remove('scale-0');
            } else {
                card.classList.remove('ring-2', 'ring-brand', 'bg-brand/5');
                check.classList.add('scale-0');
            }
        });

        // LOADING SIMULATION
        emptyState.classList.add('hidden');
        posterPreview.classList.add('hidden');
        posterPreview.classList.remove('animate-fade-in');

        const loader = document.getElementById('map-loader');
        loader.classList.remove('hidden');

        // Delay
        setTimeout(() => {
            loader.classList.add('hidden');

            // Show Preview
            posterPreview.classList.remove('hidden');
            posterPreview.classList.add('animate-fade-in');

            // Update Preview Colors
            previewMapLayer.style.backgroundColor = theme.color;

            // Show Controls
            zoomControls.classList.remove('opacity-0', 'translate-y-20');
            btnExport.disabled = false;

            // Fake City Name if input empty
            if (!cityInput.value) {
                previewCity.textContent = "SELECT CITY";
                previewCity.classList.add('opacity-50');
            } else {
                previewCity.textContent = cityInput.value;
                previewCity.classList.remove('opacity-50');
            }

        }, 600);
    }

    // Input Listener
    cityInput.addEventListener('input', (e) => {
        if (selectedThemeId && posterPreview.classList.contains('hidden') === false) {
            previewCity.textContent = e.target.value || "CITY";
        }
    });

    // Export Modal
    btnExport.addEventListener('click', () => {
        modalOverlay.classList.remove('hidden');
        setTimeout(() => {
            modalOverlay.classList.remove('opacity-0');
            const content = modalOverlay.querySelector('#modal-content');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }, 10);
    });

    function closeModal() {
        modalOverlay.classList.add('opacity-0');
        const content = modalOverlay.querySelector('#modal-content');
        content.classList.remove('scale-100');
        content.classList.add('scale-95');
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
        }, 300);
    }

    document.getElementById('btn-modal-close-icon').addEventListener('click', closeModal);

    document.getElementById('btn-modal-reset').addEventListener('click', () => {
        closeModal();
        // Reset State
        selectedThemeId = null;
        posterPreview.classList.add('hidden');
        emptyState.classList.remove('hidden');
        zoomControls.classList.add('opacity-0', 'translate-y-20');
        btnExport.disabled = true;
        cityInput.value = '';

        // Reset Cards
        document.querySelectorAll('.theme-card').forEach(card => {
            card.classList.remove('ring-2', 'ring-brand', 'bg-brand/5');
            card.querySelector('.check-icon').classList.add('scale-0');
        });
    });

    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

});
