// Theme Data
const themes = [
    { id: 'noir', name: 'Noir', color: '#1a1a1a' },
    { id: 'blueprint', name: 'Blueprint', color: '#1e3a8a' },
    { id: 'vintage', name: 'Vintage', color: '#d4c4a8' },
    { id: 'atlas', name: 'Atlas', color: '#e5e7eb' },
    { id: 'dark-mode', name: 'Dark Mode', color: '#111827' },
    { id: 'minimal', name: 'Minimal', color: '#ffffff' },
    { id: 'sunset', name: 'Sunset', color: '#c2410c' },
    { id: 'ocean', name: 'Ocean', color: '#0e7490' },
    { id: 'forest', name: 'Forest', color: '#14532d' },
    { id: 'copper', name: 'Copper', color: '#78350f' },
];

document.addEventListener('DOMContentLoaded', () => {

    // DOM Elements
    const themeGrid = document.getElementById('theme-grid');
    const emptyState = document.getElementById('empty-state');
    const posterPreview = document.getElementById('poster-preview');
    const mapCanvas = document.getElementById('map-canvas');
    const btnExport = document.getElementById('btn-export');
    const modalOverlay = document.getElementById('modal-overlay');
    const btnModalClose = document.getElementById('btn-modal-close');
    const btnModalReset = document.getElementById('btn-modal-reset');
    const zoomControls = document.getElementById('zoom-controls');

    let selectedThemeId = null;

    // Initialize Theme Grid
    themes.forEach(theme => {
        const card = document.createElement('div');
        card.className = `
            relative aspect-square rounded-xl border border-border bg-base cursor-pointer 
            hover:border-white/20 hover:translate-y-[-2px] transition-all group overflow-hidden
        `;
        card.dataset.id = theme.id;
        card.onclick = () => selectTheme(theme.id);

        // Preview Swatch (Simulated Map)
        const swatch = document.createElement('div');
        swatch.className = 'absolute inset-2 top-2 bottom-8 rounded-lg opacity-80';
        swatch.style.backgroundColor = theme.color;
        // Add subtle grid line pattern to simulate map
        swatch.style.backgroundImage = 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)';
        swatch.style.backgroundSize = '10px 10px';

        // Label
        const label = document.createElement('span');
        label.className = 'absolute bottom-2 left-0 right-0 text-center text-[10px] font-medium text-txt-muted group-hover:text-txt-primary transition-colors';
        label.textContent = theme.name;

        // Checkmark (Hidden by default)
        const check = document.createElement('div');
        check.className = 'absolute top-1 right-1 w-4 h-4 rounded-full bg-brand text-white flex items-center justify-center opacity-0 scale-50 transition-all check-icon';
        check.innerHTML = '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';

        card.appendChild(swatch);
        card.appendChild(label);
        card.appendChild(check);
        themeGrid.appendChild(card);
    });

    // Theme Selection Logic
    function selectTheme(id) {
        if (selectedThemeId === id) return;
        selectedThemeId = id;

        // Update Grid UI
        Array.from(themeGrid.children).forEach(card => {
            const isSelected = card.dataset.id === id;
            const check = card.querySelector('.check-icon');

            if (isSelected) {
                card.classList.add('border-brand', 'ring-1', 'ring-brand');
                card.classList.remove('border-border');
                check.classList.remove('opacity-0', 'scale-50');
            } else {
                card.classList.remove('border-brand', 'ring-1', 'ring-brand');
                card.classList.add('border-border');
                check.classList.add('opacity-0', 'scale-50');
            }
        });

        // LOADING STATE
        // 1. Hide Empty State
        emptyState.classList.add('hidden');

        // 2. Hide Preview (if visible)
        posterPreview.classList.add('hidden');
        posterPreview.classList.remove('animate-fade-in');

        // 3. Show Loading Spinner (Create if not exists)
        let loader = document.getElementById('map-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'map-loader';
            loader.className = 'flex flex-col items-center justify-center';
            loader.innerHTML = `
                <div class="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mb-4"></div>
                <p class="text-xs text-txt-muted animate-pulse">Generating map...</p>
            `;
            mapCanvas.appendChild(loader);
        }
        loader.classList.remove('hidden');

        // 4. Simulate Network Delay (800ms)
        setTimeout(() => {
            loader.classList.add('hidden');

            // Show Preview
            posterPreview.classList.remove('hidden');
            posterPreview.classList.add('animate-fade-in');

            // Show Zoom Controls
            zoomControls.classList.remove('opacity-0', 'translate-y-4');

            // Update Map Colors (Simulation)
            const theme = themes.find(t => t.id === id);
            const mapBg = posterPreview.querySelector('div > div');
            if (mapBg) mapBg.style.backgroundColor = theme.color;

            // Enable Export
            btnExport.disabled = false;
        }, 800);
    }

    // Export Flow
    btnExport.addEventListener('click', () => {
        // Show Modal
        modalOverlay.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => {
            modalOverlay.classList.remove('opacity-0');
            modalOverlay.querySelector('#modal-content').classList.remove('scale-95');
            modalOverlay.querySelector('#modal-content').classList.add('scale-100');
        }, 10);
    });

    function closeModal() {
        modalOverlay.classList.add('opacity-0');
        modalOverlay.querySelector('#modal-content').classList.remove('scale-100');
        modalOverlay.querySelector('#modal-content').classList.add('scale-95');
        setTimeout(() => {
            modalOverlay.classList.add('hidden');
        }, 300);
    }

    btnModalClose.addEventListener('click', closeModal);

    btnModalReset.addEventListener('click', () => {
        closeModal();
        // Reset Logic
        selectedThemeId = null;
        posterPreview.classList.add('hidden');
        emptyState.classList.remove('hidden');
        zoomControls.classList.add('opacity-0', 'translate-y-4');
        btnExport.disabled = true;

        // Clear Grid Selection
        Array.from(themeGrid.children).forEach(card => {
            card.classList.remove('border-brand', 'ring-1', 'ring-brand');
            card.classList.add('border-border');
            card.querySelector('.check-icon').classList.add('opacity-0', 'scale-50');
        });
    });

    // Close modal on click outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

});
