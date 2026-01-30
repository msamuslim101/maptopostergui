/**
 * MapToPoster API Client
 * Connects React frontend to FastAPI backend
 */

const API_BASE = 'http://127.0.0.1:8000';

export interface Theme {
    id: string;
    name: string;
    description?: string;
    bg: string;
    text: string;
}

export interface GenerateRequest {
    city: string;
    country: string;
    theme: string;
    distance?: number;
    show_city_name?: boolean;
    show_country_name?: boolean;  // NEW
    show_coordinates?: boolean;
    orientation?: 'portrait' | 'landscape';  // NEW
    poster_size?: string;  // NEW: '18x24', '24x36', '12x16', 'A3', 'A2'
    filename?: string;  // NEW
}

export interface JobStatus {
    job_id: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number;
    message: string;
    result_path?: string;
    error?: string;
}

export interface Poster {
    filename: string;
    size_bytes: number;
    created_at: string;
    url: string;
}

/**
 * Fetch available themes from the backend
 */
export async function fetchThemes(): Promise<Theme[]> {
    const response = await fetch(`${API_BASE}/api/themes`);
    if (!response.ok) {
        throw new Error('Failed to fetch themes');
    }
    const data = await response.json();
    return data.themes;
}

/**
 * Start a poster generation job
 */
export async function generatePoster(request: GenerateRequest): Promise<string> {
    const response = await fetch(`${API_BASE}/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to start generation');
    }

    const data = await response.json();
    return data.job_id;
}

/**
 * Poll job status
 */
export async function getJobStatus(jobId: string): Promise<JobStatus> {
    const response = await fetch(`${API_BASE}/api/jobs/${jobId}`);
    if (!response.ok) {
        throw new Error('Failed to get job status');
    }
    return response.json();
}

/**
 * Get the URL for a poster image
 */
export function getPosterUrl(filename: string): string {
    return `${API_BASE}/api/posters/${filename}`;
}

/**
 * List all generated posters
 */
export async function listPosters(): Promise<Poster[]> {
    const response = await fetch(`${API_BASE}/api/posters`);
    if (!response.ok) {
        throw new Error('Failed to list posters');
    }
    const data = await response.json();
    return data.posters;
}

/**
 * Poll for job completion with progress callback
 */
export async function pollJobUntilComplete(
    jobId: string,
    onProgress: (status: JobStatus) => void,
    intervalMs = 1000
): Promise<JobStatus> {
    return new Promise((resolve, reject) => {
        const poll = async () => {
            try {
                const status = await getJobStatus(jobId);
                onProgress(status);

                if (status.status === 'completed') {
                    resolve(status);
                } else if (status.status === 'failed') {
                    reject(new Error(status.error || 'Job failed'));
                } else {
                    setTimeout(poll, intervalMs);
                }
            } catch (error) {
                reject(error);
            }
        };
        poll();
    });
}
