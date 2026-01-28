// MapToPoster Theme Data
// Full 10 Theme Collection (V1 + V2)

export interface Theme {
    id: string;
    name: string;
    color: string;
    style: string;
}

export const themes: Theme[] = [
    { id: 'noir', name: 'Noir', color: '#000000', style: 'dark' },
    { id: 'blueprint', name: 'Blueprint', color: '#1e3a8a', style: 'blue' },
    { id: 'sunset', name: 'Sunset', color: '#c2410c', style: 'orange' },
    { id: 'magma', name: 'Magma', color: '#1a1a1a', style: 'red' },
    { id: 'ocean', name: 'Ocean', color: '#0e7490', style: 'cyan' },
    { id: 'forest', name: 'Forest', color: '#14532d', style: 'green' },
    { id: 'vintage', name: 'Vintage', color: '#d4c4a8', style: 'light' },
    { id: 'atlas', name: 'Atlas', color: '#e5e7eb', style: 'light' },
    { id: 'minimal', name: 'Minimal', color: '#ffffff', style: 'light' },
    { id: 'copper', name: 'Copper', color: '#78350f', style: 'brown' },
];
