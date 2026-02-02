import { useState, useCallback, useEffect } from 'react'
import { themes } from './data/themes'
import {
    fetchThemes,
    generatePoster,
    pollJobUntilComplete,
    getPosterUrl,
    type Theme as APITheme,
    type JobStatus
} from './api/client'

// Wails bindings - these are auto-generated when you run `wails dev`
import { Minimize, Maximize, Close, ShowSaveDialog, SaveFile, OpenFolder, IsWails } from '../wailsjs/go/main/App'

// Lucide React Icons - inline SVG components for exact prototype match
const MapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z" />
        <path d="M15 5.764v15" />
        <path d="M9 3.236v15" />
    </svg>
)

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
    </svg>
)

const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
)

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
    </svg>
)

const PaletteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" /><circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
    </svg>
)

const LayersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
        <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
)

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6" />
    </svg>
)

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 9 6 6 6-6" />
    </svg>
)

const MapPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
    </svg>
)

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
    </svg>
)

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
)

const MaximizeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H5a2 2 0 0 0-2 2v3" /><path d="M21 8V5a2 2 0 0 0-2-2h-3" /><path d="M3 16v3a2 2 0 0 0 2 2h3" /><path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
)

const RectangleVerticalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="12" height="20" x="6" y="2" rx="2" />
    </svg>
)

const RectangleHorizontalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="12" x="2" y="6" rx="2" />
    </svg>
)

const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
    </svg>
)

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
)

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
)

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

const RefreshIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
    </svg>
)

const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />
    </svg>
)

function App() {
    const [cityInput, setCityInput] = useState('')
    const [countryInput, setCountryInput] = useState('')  // No default - user must enter
    const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [loadingMessage, setLoadingMessage] = useState('')
    const [progress, setProgress] = useState(0)
    const [showPreview, setShowPreview] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')
    const [showCityName, setShowCityName] = useState(true)
    const [showCountryName, setShowCountryName] = useState(true)  // NEW
    const [showCoordinates, setShowCoordinates] = useState(true)
    const [filename, setFilename] = useState('')
    const [posterImageUrl, setPosterImageUrl] = useState<string | null>(null)
    const [apiThemes, setApiThemes] = useState<APITheme[]>([])
    const [backendConnected, setBackendConnected] = useState(false)
    const [distance, setDistance] = useState(15000)  // NEW: default 15km
    const [posterSize, setPosterSize] = useState('18x24')  // NEW

    // New state for 5 improvements
    const [zoomLevel, setZoomLevel] = useState(100)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [exportedPosterPath, setExportedPosterPath] = useState<string | null>(null)
    const [isGenerating, setIsGenerating] = useState(false) // Separate from isLoading for generation state

    // Settings state (persisted in localStorage)
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('maptoposter_settings')
        return saved ? JSON.parse(saved) : {
            defaultDpi: '300',
            saveLocation: 'posters',
            hardwareAcceleration: true
        }
    })

    // Save settings to localStorage
    useEffect(() => {
        localStorage.setItem('maptoposter_settings', JSON.stringify(settings))
    }, [settings])

    // Toast helper
    const showToast = (message: string) => {
        setToastMessage(message)
        setTimeout(() => setToastMessage(null), 3000)
    }

    // Copy to clipboard helper
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            showToast('Path copied to clipboard!')
        } catch {
            showToast('Failed to copy')
        }
    }

    // Derive selected theme from local themes (fallback) or API themes
    const selectedTheme = themes.find(t => t.id === selectedThemeId)

    // Fetch themes from API on mount
    useEffect(() => {
        fetchThemes()
            .then(themes => {
                setApiThemes(themes)
                setBackendConnected(true)
            })
            .catch(() => {
                setBackendConnected(false)
            })
    }, [])

    const handleThemeSelect = useCallback((id: string) => {
        if (selectedThemeId === id) return
        setSelectedThemeId(id)
        setShowPreview(false)
        setIsLoading(true)
        setLoadingMessage('Loading theme preview...')

        setTimeout(() => {
            setIsLoading(false)
            setShowPreview(true)
        }, 600)
    }, [selectedThemeId])

    // Real export with API call
    const handleExport = async () => {
        if (!cityInput || !countryInput || !selectedThemeId) {
            showToast('Please enter city, country and select a theme')
            return
        }

        setIsGenerating(true)
        setIsLoading(true)
        setLoadingMessage('Starting generation...')
        setProgress(0)

        try {
            // Start the generation job
            const jobId = await generatePoster({
                city: cityInput,
                country: countryInput,
                theme: selectedThemeId,
                distance: distance,
                show_city_name: showCityName,
                show_country_name: showCountryName,
                show_coordinates: showCoordinates,
                orientation: orientation,
                poster_size: posterSize,
                filename: filename || undefined
            })

            // Poll for completion
            const result = await pollJobUntilComplete(jobId, (status: JobStatus) => {
                setProgress(status.progress)
                setLoadingMessage(status.message)
            })

            // Set the poster image URL and path
            if (result.result_path) {
                const posterFilename = result.result_path.split('/').pop() || result.result_path.split('\\').pop()
                if (posterFilename) {
                    setPosterImageUrl(getPosterUrl(posterFilename))
                    setFilename(posterFilename.replace('.png', ''))
                    setExportedPosterPath(result.result_path)
                }
            }

            setIsLoading(false)
            setIsGenerating(false)
            setShowModal(true)
        } catch (error) {
            setIsLoading(false)
            setIsGenerating(false)
            showToast(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    // Zoom handlers
    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200))
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50))
    const handleZoomReset = () => setZoomLevel(100)

    // Open folder (opens in explorer for Wails, copies to clipboard for web)
    const handleOpenFolder = async () => {
        if (exportedPosterPath) {
            try {
                // Wails: open folder in file explorer
                await OpenFolder(exportedPosterPath)
                showToast('Opened in File Explorer')
            } catch {
                // Web fallback: copy path to clipboard
                copyToClipboard(exportedPosterPath)
            }
        }
        closeModal()
    }

    // Download poster to user's PC (with native save dialog in Wails)
    const handleDownload = async () => {
        if (!posterImageUrl) return

        try {
            // Use native save dialog (Wails)
            const defaultName = `${filename || 'map_poster'}.png`
            const savePath = await ShowSaveDialog(defaultName)

            if (savePath) {
                // Save file to chosen location
                const success = await SaveFile(posterImageUrl, savePath)
                if (success) {
                    showToast(`Saved to ${savePath}`)
                    setExportedPosterPath(savePath)
                } else {
                    showToast('Save failed')
                }
            }
        } catch {
            // Web fallback: browser download
            try {
                const response = await fetch(posterImageUrl)
                const blob = await response.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `${filename || 'map_poster'}.png`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
                showToast('Download started!')
            } catch {
                showToast('Download failed')
            }
        }
    }

    const closeModal = () => {
        setShowModal(false)
    }

    const handleReset = () => {
        setShowModal(false)
        setSelectedThemeId(null)
        setShowPreview(false)
        setCityInput('')
        setCountryInput('')  // Also clear country
        setPosterImageUrl(null)
        setExportedPosterPath(null)
        setZoomLevel(100)
        setFilename('')
        setDistance(15000)
    }


    return (
        <div className="bg-[var(--bg-base)] text-[var(--text-primary)] h-screen w-screen overflow-hidden flex flex-col selection:bg-[var(--accent-primary)] selection:text-[var(--bg-base)] selection:bg-opacity-30 font-['Inter',sans-serif]">

            {/* TITLE BAR (V1 Feature) */}
            <div className="h-[40px] flex items-center justify-between px-4 bg-[var(--bg-surface)]/50 border-b border-[var(--border-subtle)] select-none draggable-region z-50">
                <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                    <span className="text-[var(--accent-primary)]"><MapIcon /></span>
                    <span>MapToPoster</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Settings Button */}
                    <button
                        onClick={() => setShowSettingsModal(true)}
                        className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors p-1 rounded hover:bg-white/5"
                        title="Settings"
                    >
                        <SettingsIcon />
                    </button>
                    {/* Window Controls (Wails) */}
                    <div className="flex gap-2">
                        <div
                            onClick={() => Minimize()}
                            className="w-3 h-3 rounded-full bg-yellow-500/20 hover:bg-yellow-500 transition-colors cursor-pointer"
                            title="Minimize"
                        ></div>
                        <div
                            onClick={() => Maximize()}
                            className="w-3 h-3 rounded-full bg-green-500/20 hover:bg-green-500 transition-colors cursor-pointer"
                            title="Maximize"
                        ></div>
                        <div
                            onClick={() => Close()}
                            className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500 transition-colors cursor-pointer"
                            title="Close"
                        ></div>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT ROW */}
            <div className="flex-1 flex overflow-hidden">

                {/* LEFT SIDEBAR */}
                <aside className="w-80 flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 backdrop-blur-sm z-20 shadow-xl shrink-0">

                    {/* Header */}
                    <div className="px-6 py-5">
                        <h1 className="text-[var(--text-primary)] tracking-tight text-xl font-bold flex items-center gap-2">
                            Create Poster
                        </h1>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-2 space-y-8 custom-scrollbar">

                        {/* Location Search */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider ml-1">Location</label>

                            {/* City Input */}
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors">
                                    <SearchIcon />
                                </span>
                                <input
                                    type="text"
                                    value={cityInput}
                                    onChange={(e) => setCityInput(e.target.value)}
                                    placeholder="Enter city..."
                                    className="block w-full pl-10 pr-10 py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-white placeholder-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none transition-all shadow-sm"
                                />
                                {cityInput && (
                                    <button
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                                        onClick={() => setCityInput('')}
                                    >
                                        <XIcon />
                                    </button>
                                )}
                            </div>

                            {/* Country Input */}
                            <div className="relative group">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent-primary)] transition-colors">
                                    <MapIcon />
                                </span>
                                <input
                                    type="text"
                                    value={countryInput}
                                    onChange={(e) => setCountryInput(e.target.value)}
                                    placeholder="Enter country..."
                                    className="block w-full pl-10 pr-10 py-3 text-sm bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-white placeholder-[var(--text-muted)] focus:border-[var(--accent-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] focus:outline-none transition-all shadow-sm"
                                />
                                {countryInput && (
                                    <button
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
                                        onClick={() => setCountryInput('')}
                                    >
                                        <XIcon />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Distance Slider */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Map Radius</label>
                                <span className="text-xs font-medium text-[var(--accent-primary)]">{(distance / 1000).toFixed(0)} km</span>
                            </div>
                            <input
                                type="range"
                                min="5000"
                                max="30000"
                                step="1000"
                                value={distance}
                                onChange={(e) => setDistance(Number(e.target.value))}
                                className="w-full h-1.5 bg-[var(--bg-base)] rounded-full appearance-none cursor-pointer accent-[var(--accent-primary)] [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent-primary)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg"
                            />
                            <div className="flex justify-between text-[10px] text-[var(--text-muted)]">
                                <span>5 km</span>
                                <span>15 km</span>
                                <span>30 km</span>
                            </div>
                        </div>

                        {/* Themes Grid */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Themes</label>
                                <span className="text-[10px] bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] px-2 py-0.5 rounded-full font-medium">
                                    {themes.length} Available
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => handleThemeSelect(theme.id)}
                                        className={`group relative flex flex-col gap-2 p-1 rounded-xl transition-all border text-left
                      ${selectedThemeId === theme.id
                                                ? 'border-[var(--accent-primary)] ring-2 ring-[var(--accent-primary)] bg-[var(--accent-primary)]/5'
                                                : 'border-transparent hover:border-white/10'}`}
                                    >
                                        <div
                                            className={`absolute top-2 right-2 bg-[var(--accent-primary)] text-black rounded-full p-1 z-10 shadow-lg transition-transform flex items-center justify-center
                        ${selectedThemeId === theme.id ? 'scale-100' : 'scale-0'}`}
                                        >
                                            <CheckIcon />
                                        </div>
                                        <div
                                            className="w-full aspect-square rounded-lg overflow-hidden relative shadow-inner transition-transform group-hover:scale-[1.02]"
                                            style={{ backgroundColor: theme.color }}
                                        >
                                            <div
                                                className="absolute inset-0 opacity-30"
                                                style={{ backgroundImage: "linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.5) 48%, rgba(255,255,255,0.5) 52%, transparent 52%)", backgroundSize: "30px 30px" }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] px-1">{theme.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Extra Options (V2 Future Proofing) */}
                        <div className="space-y-2 pt-4 border-t border-[var(--border-subtle)]">
                            <button className="flex items-center justify-between w-full p-2 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
                                <span className="flex items-center gap-2">
                                    <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors"><PaletteIcon /></span>
                                    Custom Colors
                                </span>
                                <ChevronRightIcon />
                            </button>
                            <button className="flex items-center justify-between w-full p-2 text-sm text-[var(--text-secondary)] hover:text-white hover:bg-white/5 rounded-lg transition-colors group">
                                <span className="flex items-center gap-2">
                                    <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors"><LayersIcon /></span>
                                    Map Layers
                                </span>
                                <ChevronRightIcon />
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-[var(--border-subtle)] text-center">
                        <p className="text-[10px] text-[var(--text-muted)]">v3.0.0 • Final Design</p>
                    </div>
                </aside>


                {/* CENTER CANVAS */}
                <main className="flex-1 relative bg-[#0a0a0a] flex flex-col z-10 overflow-hidden shadow-inner">

                    {/* Top Toolbar (V2 Feature) */}
                    <div
                        className={`absolute top-6 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ${showPreview ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <div className="bg-[var(--bg-surface)]/80 backdrop-blur-md border border-white/5 rounded-full px-4 py-1.5 shadow-xl flex items-center gap-4 text-xs font-medium text-[var(--text-secondary)]">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Live Preview
                            </span>
                            <span className="w-px h-3 bg-white/20"></span>
                            <span>300 DPI</span>
                        </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="relative w-full h-full flex items-center justify-center p-12 bg-grid-pattern transition-colors duration-500">

                        {/* EMPTY STATE (V2 Design) */}
                        {!selectedThemeId && !isLoading && (
                            <div className="text-center flex flex-col items-center animate-fade-in z-20">
                                <div className="w-20 h-20 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 shadow-2xl rotate-3 group">
                                    <span className="text-[var(--accent-primary)] group-hover:scale-110 transition-transform"><MapPinIcon /></span>
                                </div>
                                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Design Your Map</h2>
                                <p className="text-[var(--text-secondary)] text-sm max-w-xs">Select a location and theme to begin generating your artistic poster.</p>
                            </div>
                        )}

                        {/* ENHANCED LOADING OVERLAY (Improvement #1) */}
                        {isGenerating && (
                            <div className="flex flex-col items-center gap-8 w-full max-w-lg animate-fade-in z-50">
                                {/* Poster Skeleton */}
                                <div className="relative w-[340px] aspect-[3/4] rounded bg-[#1a1a1a] shadow-2xl border border-white/10 overflow-hidden">
                                    {/* Decorative Road Lines */}
                                    <div className="absolute inset-0 opacity-30">
                                        <div className="absolute top-1/4 left-0 w-full h-[2px] bg-white/10 transform -rotate-12"></div>
                                        <div className="absolute top-1/2 left-0 w-full h-[3px] bg-white/10 transform rotate-6"></div>
                                        <div className="absolute top-0 right-1/4 h-full w-[2px] bg-white/10 transform rotate-3"></div>
                                        <div className="absolute bottom-0 left-1/3 h-full w-[1px] bg-white/10 transform -rotate-45"></div>
                                    </div>
                                    {/* Scan Animation */}
                                    <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-[var(--accent-primary)]/10 to-transparent h-1/2 w-full animate-scan pointer-events-none blur-sm"></div>
                                    <div className="absolute inset-0 z-20 border-b border-[var(--accent-primary)]/30 h-1/2 w-full animate-scan pointer-events-none"></div>
                                    {/* Center Spinner with Ripple */}
                                    <div className="absolute inset-0 flex items-center justify-center z-30">
                                        <div className="absolute w-24 h-24 bg-[var(--accent-primary)]/20 rounded-full animate-ripple"></div>
                                        <div className="absolute w-16 h-16 bg-[var(--accent-primary)]/10 rounded-full animate-pulse opacity-40"></div>
                                        <div className="bg-[#1a1a1a] p-3 rounded-full border border-[var(--accent-primary)]/50 shadow-[0_0_15px_rgba(0,178,143,0.3)]">
                                            <span className="text-[var(--accent-primary)] animate-spin block"><RefreshIcon /></span>
                                        </div>
                                    </div>
                                    {/* Bottom Text Skeleton */}
                                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                                        <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
                                        <div className="h-3 w-16 bg-white/5 rounded animate-pulse"></div>
                                    </div>
                                </div>
                                {/* Status Text */}
                                <div className="text-center space-y-2">
                                    <h2 className="text-xl font-semibold text-white tracking-tight">Generating your map poster...</h2>
                                    <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] font-mono">
                                        <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse"></span>
                                        <p>{loadingMessage || 'Processing...'}</p>
                                    </div>
                                </div>
                                {/* Progress Bar with Shimmer */}
                                <div className="w-64 h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--accent-primary)] rounded-full shadow-[0_0_10px_rgba(0,178,143,0.5)] relative overflow-hidden transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-shimmer w-full h-full -skew-x-12"></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Simple theme preview loader (not generation) */}
                        {isLoading && !isGenerating && (
                            <div className="flex flex-col items-center z-50">
                                <div className="w-10 h-10 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                                <p className="text-xs font-medium text-[var(--accent-primary)] animate-pulse">{loadingMessage || 'Loading...'}</p>
                            </div>
                        )}

                        {/* POSTER PREVIEW (Improvement #4 - Show exported poster) */}
                        {showPreview && selectedTheme && !isGenerating && (
                            <div
                                className="relative bg-black shadow-2xl overflow-hidden aspect-[3/4] h-full max-h-[85vh] ring-1 ring-white/10 rounded-sm cursor-grab active:cursor-grabbing group animate-fade-in transition-transform duration-300"
                                style={{
                                    backgroundColor: selectedTheme.color,
                                    transform: `scale(${zoomLevel / 100})`
                                }}
                            >
                                {/* Show actual exported image if available */}
                                {posterImageUrl ? (
                                    <img
                                        src={posterImageUrl}
                                        alt="Generated Map Poster"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <>
                                        {/* Map Layer (placeholder) */}
                                        <div className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700">
                                            <div
                                                className="absolute inset-0 opacity-20 pointer-events-none"
                                                style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "50px 50px" }}
                                            ></div>
                                        </div>
                                        {/* Text Layer */}
                                        <div className="absolute bottom-16 left-0 w-full text-center z-10 pointer-events-none mix-blend-difference text-white">
                                            <h2 className="text-4xl font-bold uppercase tracking-[0.2em] font-sans mb-2">
                                                {cityInput || 'CITY'}
                                            </h2>
                                            <p className="text-xs font-light tracking-[0.1em] uppercase opacity-80">COORDINATES</p>
                                            <div className="w-12 h-px bg-white/50 mx-auto mt-6"></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Zoom Controls (Improvement #5 - Working controls) */}
                    <div
                        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 ${posterImageUrl ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
                    >
                        <div className="bg-[var(--bg-base)]/80 backdrop-blur-md border border-[var(--border-subtle)] rounded-full p-1.5 shadow-2xl flex items-center gap-1">
                            <button
                                onClick={handleZoomOut}
                                disabled={zoomLevel <= 50}
                                className="p-2 text-[var(--text-primary)] hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <MinusIcon />
                            </button>
                            <div className="px-2 min-w-[3rem] text-center text-xs font-medium text-[var(--text-secondary)] select-none">
                                {zoomLevel}%
                            </div>
                            <button
                                onClick={handleZoomIn}
                                disabled={zoomLevel >= 200}
                                className="p-2 text-[var(--text-primary)] hover:bg-white/10 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <PlusIcon />
                            </button>
                            <div className="w-px h-4 bg-white/10 mx-1"></div>
                            <button
                                onClick={handleZoomReset}
                                className="p-2 text-[var(--text-primary)] hover:bg-white/10 rounded-full transition-colors"
                                title="Fit to screen"
                            >
                                <MaximizeIcon />
                            </button>
                        </div>
                    </div>

                </main>


                {/* RIGHT SIDEBAR */}
                <aside className="w-80 flex flex-col border-l border-[var(--border-subtle)] bg-[var(--bg-surface)] z-20 shadow-xl shrink-0">
                    <div className="px-6 py-5 border-b border-[var(--border-subtle)]">
                        <h2 className="text-[var(--text-primary)] text-lg font-semibold tracking-tight">Print Settings</h2>
                        <p className="text-[var(--text-muted)] text-xs mt-1">Configure your output format</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                        {/* Format with Orientation Toggle (V2 Feature) */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Size & Orientation</label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <select
                                        value={posterSize}
                                        onChange={(e) => setPosterSize(e.target.value)}
                                        className="appearance-none block w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] text-white text-sm rounded-lg focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] p-2.5 pr-8 focus:outline-none"
                                    >
                                        <option value="18x24">18 × 24 in</option>
                                        <option value="24x36">24 × 36 in</option>
                                        <option value="12x16">12 × 16 in</option>
                                        <option value="A3">A3 (ISO)</option>
                                        <option value="A2">A2 (ISO)</option>
                                    </select>
                                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none"><ChevronDownIcon /></span>
                                </div>

                                <div className="flex bg-[var(--bg-base)] rounded-lg border border-[var(--border-subtle)] p-1">
                                    <button
                                        onClick={() => setOrientation('portrait')}
                                        className={`flex-1 flex items-center justify-center rounded transition-all ${orientation === 'portrait' ? 'bg-[var(--bg-surface)] shadow-sm text-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-white'}`}
                                    >
                                        <RectangleVerticalIcon />
                                    </button>
                                    <button
                                        onClick={() => setOrientation('landscape')}
                                        className={`flex-1 flex items-center justify-center rounded transition-all ${orientation === 'landscape' ? 'bg-[var(--bg-surface)] shadow-sm text-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:text-white'}`}
                                    >
                                        <RectangleHorizontalIcon />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Toggles using V2 Modern Switches */}
                        <div className="space-y-4">
                            <label className="text-sm font-medium text-[var(--text-secondary)] block border-b border-[var(--border-subtle)] pb-2 mb-4">Overlay Elements</label>

                            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setShowCityName(!showCityName)}>
                                <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">Show City Name</span>
                                <div className="relative inline-flex items-center pointer-events-none">
                                    <div className={`w-9 h-5 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${showCityName ? 'bg-[var(--accent-primary)] after:translate-x-full after:border-white' : 'bg-[var(--border-subtle)]'}`}></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setShowCountryName(!showCountryName)}>
                                <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">Show Country Name</span>
                                <div className="relative inline-flex items-center pointer-events-none">
                                    <div className={`w-9 h-5 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${showCountryName ? 'bg-[var(--accent-primary)] after:translate-x-full after:border-white' : 'bg-[var(--border-subtle)]'}`}></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between group cursor-pointer" onClick={() => setShowCoordinates(!showCoordinates)}>
                                <span className="text-sm text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">Show Coordinates</span>
                                <div className="relative inline-flex items-center pointer-events-none">
                                    <div className={`w-9 h-5 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${showCoordinates ? 'bg-[var(--accent-primary)] after:translate-x-full after:border-white' : 'bg-[var(--border-subtle)]'}`}></div>
                                </div>
                            </div>
                        </div>

                        {/* Filename */}
                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium text-[var(--text-secondary)]">Filename</label>
                            <div className="flex">
                                <input
                                    type="text"
                                    value={filename}
                                    onChange={(e) => setFilename(e.target.value)}
                                    className="rounded-l-lg bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] block flex-1 min-w-0 w-full text-sm border-r-0 p-2.5 focus:outline-none"
                                />
                                <span className="inline-flex items-center px-3 text-sm text-[var(--text-muted)] bg-[var(--bg-subtle)] border border-l-0 border-[var(--border-subtle)] rounded-r-lg">.png</span>
                            </div>
                        </div>

                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
                        <button
                            onClick={handleExport}
                            disabled={!showPreview}
                            className="w-full text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-lg text-sm px-5 py-3.5 focus:outline-none transition-all flex items-center justify-center gap-2 shadow-lg shadow-[var(--accent-primary)]/20 active:scale-[0.98]"
                        >
                            <DownloadIcon />
                            Export Poster
                        </button>
                    </div>
                </aside>
            </div>

            {/* Export Success Modal (Improvement #2 - Working buttons) */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center"
                    onClick={(e) => e.target === e.currentTarget && closeModal()}
                >
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl w-[400px] p-8 relative animate-fade-in">

                        <button onClick={closeModal} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white">
                            <XIcon />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/20 flex items-center justify-center mb-6">
                                <span className="text-[var(--accent-primary)]"><CheckCircleIcon /></span>
                            </div>
                            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Poster Exported Successfully!</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-6">Your high-resolution map of {cityInput || 'your city'} is ready for printing.</p>

                            <div className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <FolderIcon />
                                    <code className="text-xs text-[var(--accent-primary)] truncate font-mono">{exportedPosterPath || `${filename}.png`}</code>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(exportedPosterPath || `${filename}.png`)}
                                    className="text-[var(--text-muted)] hover:text-white transition-colors ml-2 shrink-0"
                                    title="Copy path"
                                >
                                    <CopyIcon />
                                </button>
                            </div>

                            <div className="flex flex-col gap-3 w-full">
                                {/* Primary Action: Download to PC */}
                                <button
                                    onClick={handleDownload}
                                    className="w-full py-3 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-sm font-bold transition-colors shadow-lg shadow-[var(--accent-primary)]/20 flex items-center justify-center gap-2"
                                >
                                    <DownloadIcon /> Download to PC
                                </button>

                                {/* Secondary Actions */}
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={handleOpenFolder}
                                        className="flex-1 py-2.5 rounded-lg border border-[var(--border-subtle)] text-sm font-medium hover:bg-white/5 transition-colors text-[var(--text-secondary)] flex items-center justify-center gap-2"
                                    >
                                        <FolderIcon /> Copy Path
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 py-2.5 rounded-lg border border-[var(--border-subtle)] text-sm font-medium hover:bg-white/5 transition-colors text-[var(--text-secondary)] flex items-center justify-center gap-2"
                                    >
                                        <PlusIcon /> Create Another
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal (Improvement #3) */}
            {showSettingsModal && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center"
                    onClick={(e) => e.target === e.currentTarget && setShowSettingsModal(false)}
                >
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl w-[500px] relative animate-fade-in overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)]">
                            <div className="flex items-center gap-2">
                                <MapIcon />
                                <h2 className="text-lg font-semibold text-[var(--text-primary)]">Settings</h2>
                            </div>
                            <button onClick={() => setShowSettingsModal(false)} className="text-[var(--text-muted)] hover:text-white">
                                <XIcon />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">

                            {/* Export Defaults */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                    <DownloadIcon /> Export Defaults
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-[var(--text-muted)] mb-1 block">Default Resolution</label>
                                        <select
                                            value={settings.defaultDpi}
                                            onChange={(e) => setSettings({ ...settings, defaultDpi: e.target.value })}
                                            className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] text-white text-sm rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                        >
                                            <option value="300">300 DPI (Standard Print)</option>
                                            <option value="600">600 DPI (High Quality)</option>
                                            <option value="150">150 DPI (Draft)</option>
                                        </select>
                                        <p className="text-xs text-[var(--text-muted)] mt-1">Higher DPI results in larger file sizes but better print quality.</p>
                                    </div>

                                    <div>
                                        <label className="text-xs text-[var(--text-muted)] mb-1 block">Save Location</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={settings.saveLocation}
                                                onChange={(e) => setSettings({ ...settings, saveLocation: e.target.value })}
                                                className="flex-1 bg-[var(--bg-base)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-sm rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]"
                                            />
                                            <button className="px-4 py-2.5 bg-[var(--bg-subtle)] border border-[var(--border-subtle)] text-sm rounded-lg hover:bg-white/5 transition-colors">
                                                Change
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* System */}
                            <div className="space-y-4 pt-4 border-t border-[var(--border-subtle)]">
                                <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                    <SettingsIcon /> System
                                </h3>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-[var(--text-primary)]">Hardware Acceleration <span className="text-xs bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] px-1.5 py-0.5 rounded ml-2">BETA</span></p>
                                        <p className="text-xs text-[var(--text-muted)]">Utilize GPU for rendering complex vector paths. May require app restart.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.hardwareAcceleration}
                                            onChange={(e) => setSettings({ ...settings, hardwareAcceleration: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className={`w-9 h-5 rounded-full peer after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${settings.hardwareAcceleration ? 'bg-[var(--accent-primary)] after:translate-x-full after:border-white' : 'bg-[var(--border-subtle)]'}`}></div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-base)]/50">
                            <p className="text-xs text-[var(--text-muted)]">MapToPoster v1.0.0</p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSettingsModal(false)}
                                    className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        showToast('Settings saved!')
                                        setShowSettingsModal(false)
                                    }}
                                    className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <CheckIcon /> Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] animate-slide-up">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 shadow-2xl flex items-center gap-3">
                        <span className="text-[var(--accent-primary)]"><CheckCircleIcon /></span>
                        <p className="text-sm text-[var(--text-primary)]">{toastMessage}</p>
                    </div>
                </div>
            )}

        </div>
    )
}

export default App
