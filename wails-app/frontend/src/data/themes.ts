// MapToPoster Theme Data
// Matched to backend themes in maptoposter-main/themes/

export interface Theme {
    id: string;
    name: string;
    color: string;
    style: string;
}

// These IDs must match the JSON files in maptoposter-main/themes/
export const themes: Theme[] = [
    { id: 'noir', name: 'Noir', color: '#1a1a1a', style: 'dark' },
    { id: 'blueprint', name: 'Blueprint', color: '#1e3a8a', style: 'blue' },
    { id: 'sunset', name: 'Sunset', color: '#ea580c', style: 'orange' },
    { id: 'midnight_blue', name: 'Midnight Blue', color: '#0f172a', style: 'dark' },
    { id: 'ocean', name: 'Ocean', color: '#0e7490', style: 'cyan' },
    { id: 'forest', name: 'Forest', color: '#14532d', style: 'green' },
    { id: 'terracotta', name: 'Terracotta', color: '#9a3412', style: 'orange' },
    { id: 'copper_patina', name: 'Copper', color: '#78350f', style: 'brown' },
    { id: 'japanese_ink', name: 'Japanese Ink', color: '#1c1917', style: 'dark' },
    { id: 'neon_cyberpunk', name: 'Neon Cyberpunk', color: '#4c1d95', style: 'purple' },
];
