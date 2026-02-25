export interface BrowserPosterTheme {
    id: string;
    name: string;
    background: string;
    roadPrimary: string;
    roadSecondary: string;
    text: string;
}

export interface BrowserPosterOptions {
    city: string;
    country: string;
    width: number;
    height: number;
    showCityName?: boolean;
    showCountryName?: boolean;
    showCoordinates?: boolean;
    coordinatesLabel?: string;
    seed?: number;
    theme: BrowserPosterTheme;
}

export type BrowserExportFormat = 'png' | 'jpg' | 'jpeg' | 'svg';

function mulberry32(seed: number): () => number {
    return () => {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Option-B starter: browser-only canvas renderer scaffold.
 * This intentionally draws a stylized preview layer set (background/roads/labels)
 * so we can progressively replace Python rendering with client-side rendering.
 */
export function renderBrowserPoster(canvas: HTMLCanvasElement, options: BrowserPosterOptions): void {
    const {
        width,
        height,
        city,
        country,
        theme,
        showCityName = true,
        showCountryName = true,
        showCoordinates = true,
        coordinatesLabel,
        seed = 2026,
    } = options;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('2D canvas context unavailable');
    }

    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, width, height);

    const rng = mulberry32(seed);

    // Secondary roads
    ctx.strokeStyle = theme.roadSecondary;
    ctx.lineWidth = Math.max(1, width * 0.0012);
    for (let i = 0; i < 160; i++) {
        drawRandomRoad(ctx, width, height, rng, 2);
    }

    // Primary roads
    ctx.strokeStyle = theme.roadPrimary;
    ctx.lineWidth = Math.max(1.5, width * 0.0024);
    for (let i = 0; i < 48; i++) {
        drawRandomRoad(ctx, width, height, rng, 3);
    }

    // Top & bottom fade, matching poster style direction.
    const topFade = ctx.createLinearGradient(0, 0, 0, height * 0.18);
    topFade.addColorStop(0, 'rgba(0,0,0,0.45)');
    topFade.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topFade;
    ctx.fillRect(0, 0, width, height * 0.18);

    const bottomFade = ctx.createLinearGradient(0, height, 0, height * 0.78);
    bottomFade.addColorStop(0, 'rgba(0,0,0,0.55)');
    bottomFade.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bottomFade;
    ctx.fillRect(0, height * 0.78, width, height * 0.22);

    ctx.fillStyle = theme.text;
    ctx.textAlign = 'center';

    if (showCityName) {
        ctx.font = `${Math.round(height * 0.065)}px system-ui, sans-serif`;
        ctx.fillText(city.toUpperCase(), width / 2, height * 0.88);
    }

    if (showCountryName) {
        ctx.font = `${Math.round(height * 0.03)}px system-ui, sans-serif`;
        ctx.fillText(country.toUpperCase(), width / 2, height * 0.93);
    }

    if (showCoordinates && coordinatesLabel) {
        ctx.font = `${Math.round(height * 0.02)}px system-ui, sans-serif`;
        ctx.fillText(coordinatesLabel, width / 2, height * 0.965);
    }
}

function drawRandomRoad(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    rng: () => number,
    segments: number
): void {
    const x = rng() * width;
    const y = rng() * height;

    ctx.beginPath();
    ctx.moveTo(x, y);

    let cx = x;
    let cy = y;
    for (let i = 0; i < segments; i++) {
        cx += (rng() - 0.5) * width * 0.25;
        cy += (rng() - 0.5) * height * 0.25;
        ctx.lineTo(cx, cy);
    }

    ctx.stroke();
}

export function exportCanvas(canvas: HTMLCanvasElement, format: BrowserExportFormat = 'png', quality = 0.92): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const normalized = format === 'jpg' ? 'jpeg' : format;

        if (normalized === 'svg') {
            const pngDataUrl = canvas.toDataURL('image/png');
            const svg = [
                `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">`,
                `<image width="${canvas.width}" height="${canvas.height}" href="${pngDataUrl}" />`,
                `</svg>`
            ].join('');
            resolve(new Blob([svg], { type: 'image/svg+xml' }));
            return;
        }

        const mime = normalized === 'jpeg' ? 'image/jpeg' : 'image/png';
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error(`Failed to export ${format.toUpperCase()} blob`));
                return;
            }
            resolve(blob);
        }, mime, normalized === 'jpeg' ? quality : undefined);
    });
}

export function extensionForFormat(format: BrowserExportFormat): 'png' | 'jpg' | 'svg' {
    if (format === 'jpeg' || format === 'jpg') return 'jpg';
    if (format === 'svg') return 'svg';
    return 'png';
}
