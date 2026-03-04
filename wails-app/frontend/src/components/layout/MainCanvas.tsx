import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { MapPinIcon, RefreshIcon, MinusIcon, PlusIcon, MaximizeIcon } from '../icons';
import { themes } from '../../data/themes';

export const MainCanvas: React.FC = () => {
    const {
        selectedThemeId, isLoading, isGenerating, progress, loadingMessage,
        showPreview, posterImageUrl, cityInput, zoomLevel, setZoomLevel
    } = useAppContext();

    const selectedTheme = themes.find(t => t.id === selectedThemeId);

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
    const handleZoomReset = () => setZoomLevel(100);

    return (
        <main className="flex-1 relative bg-[#0a0a0a] flex flex-col z-10 overflow-hidden shadow-inner">
            {/* Top Toolbar */}
            <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ${showPreview ? 'opacity-100' : 'opacity-0'}`}>
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

                {/* EMPTY STATE */}
                {!selectedThemeId && !isLoading && (
                    <div className="text-center flex flex-col items-center animate-fade-in z-20">
                        <div className="w-20 h-20 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 shadow-2xl rotate-3 group">
                            <span className="text-[var(--accent-primary)] group-hover:scale-110 transition-transform"><MapPinIcon /></span>
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Design Your Map</h2>
                        <p className="text-[var(--text-secondary)] text-sm max-w-xs">Select a location and theme to begin generating your artistic poster.</p>
                    </div>
                )}

                {/* ENHANCED LOADING OVERLAY */}
                {isGenerating && (
                    <div className="flex flex-col items-center gap-8 w-full max-w-lg animate-fade-in z-50">
                        <div className="relative w-[340px] aspect-[3/4] rounded bg-[#1a1a1a] shadow-2xl border border-white/10 overflow-hidden">
                            <div className="absolute inset-0 opacity-30">
                                <div className="absolute top-1/4 left-0 w-full h-[2px] bg-white/10 transform -rotate-12"></div>
                                <div className="absolute top-1/2 left-0 w-full h-[3px] bg-white/10 transform rotate-6"></div>
                                <div className="absolute top-0 right-1/4 h-full w-[2px] bg-white/10 transform rotate-3"></div>
                                <div className="absolute bottom-0 left-1/3 h-full w-[1px] bg-white/10 transform -rotate-45"></div>
                            </div>
                            <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-[var(--accent-primary)]/10 to-transparent h-1/2 w-full animate-scan pointer-events-none blur-sm"></div>
                            <div className="absolute inset-0 z-20 border-b border-[var(--accent-primary)]/30 h-1/2 w-full animate-scan pointer-events-none"></div>
                            <div className="absolute inset-0 flex items-center justify-center z-30">
                                <div className="absolute w-24 h-24 bg-[var(--accent-primary)]/20 rounded-full animate-ripple"></div>
                                <div className="absolute w-16 h-16 bg-[var(--accent-primary)]/10 rounded-full animate-pulse opacity-40"></div>
                                <div className="bg-[#1a1a1a] p-3 rounded-full border border-[var(--accent-primary)]/50 shadow-[0_0_15px_rgba(0,178,143,0.3)]">
                                    <span className="text-[var(--accent-primary)] animate-spin block"><RefreshIcon /></span>
                                </div>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                                <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
                                <div className="h-3 w-16 bg-white/5 rounded animate-pulse"></div>
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-semibold text-white tracking-tight">Generating your map poster...</h2>
                            <div className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] font-mono">
                                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse"></span>
                                <p>{loadingMessage || 'Processing...'}</p>
                            </div>
                        </div>
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

                {/* Simple theme preview loader */}
                {isLoading && !isGenerating && (
                    <div className="flex flex-col items-center z-50">
                        <div className="w-10 h-10 border-4 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xs font-medium text-[var(--accent-primary)] animate-pulse">{loadingMessage || 'Loading...'}</p>
                    </div>
                )}

                {/* POSTER PREVIEW */}
                {showPreview && selectedTheme && !isGenerating && (
                    <div
                        className="relative bg-black shadow-2xl overflow-hidden aspect-[3/4] h-full max-h-[85vh] ring-1 ring-white/10 rounded-sm cursor-grab active:cursor-grabbing group animate-fade-in transition-transform duration-300"
                        style={{
                            backgroundColor: selectedTheme.color,
                            transform: `scale(${zoomLevel / 100})`
                        }}
                    >
                        {posterImageUrl ? (
                            <img
                                src={posterImageUrl}
                                alt="Generated Map Poster"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <>
                                <div className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700">
                                    <div
                                        className="absolute inset-0 opacity-20 pointer-events-none"
                                        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "50px 50px" }}
                                    ></div>
                                </div>
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

            {/* Zoom Controls */}
            <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-300 ${posterImageUrl ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
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
    );
};
