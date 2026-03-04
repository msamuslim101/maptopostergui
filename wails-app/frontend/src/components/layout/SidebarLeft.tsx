import React, { useCallback } from 'react';
import { useAppContext } from '../../context/AppContext';
import {
    SearchIcon, MapIcon, XIcon, CheckIcon, PaletteIcon, LayersIcon, ChevronRightIcon, SettingsIcon
} from '../icons';
import { themes } from '../../data/themes';

export const SidebarLeft: React.FC = () => {
    const {
        cityInput, setCityInput,
        countryInput, setCountryInput,
        distance, setDistance,
        selectedThemeId, setSelectedThemeId,
        setShowPreview, setIsLoading, setLoadingMessage,
        setShowSettingsModal, legacyMode
    } = useAppContext();

    const handleThemeSelect = useCallback((id: string) => {
        if (selectedThemeId === id) return;
        setSelectedThemeId(id);
        setShowPreview(false);
        setIsLoading(true);
        setLoadingMessage('Loading theme preview...');

        setTimeout(() => {
            setIsLoading(false);
            setShowPreview(true);
        }, 600);
    }, [selectedThemeId, setSelectedThemeId, setShowPreview, setIsLoading, setLoadingMessage]);

    return (
        <aside className="w-80 flex flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 backdrop-blur-sm z-20 shadow-xl shrink-0">
            {/* Header */}
            <div className="px-6 py-5">
                <h1 className="text-[var(--text-primary)] tracking-tight text-xl font-bold flex items-center justify-between">
                    <span className="flex items-center gap-2">Create Poster</span>
                    <button
                        onClick={() => setShowSettingsModal(true)}
                        className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors p-1.5 rounded-lg hover:bg-white/5"
                        title="Settings"
                    >
                        <SettingsIcon />
                    </button>
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

                {/* Extra Options */}
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
                {legacyMode && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">Windows 7 Legacy Mode</span>
                    </div>
                )}
            </div>
        </aside>
    );
};
