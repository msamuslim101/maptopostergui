import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { ChevronDownIcon, RectangleVerticalIcon, RectangleHorizontalIcon, DownloadIcon } from '../icons';
import { generatePoster, pollJobUntilComplete, getPosterUrl, type JobStatus } from '../../api/client';

export const SidebarRight: React.FC = () => {
    const {
        posterSize, setPosterSize,
        orientation, setOrientation,
        showCityName, setShowCityName,
        showCountryName, setShowCountryName,
        showCoordinates, setShowCoordinates,
        filename, setFilename,
        showPreview, cityInput, countryInput, selectedThemeId, distance,
        setIsGenerating, setIsLoading, setLoadingMessage, setProgress,
        setPosterImageUrl, setExportedPosterPath, setShowModal, showToast
    } = useAppContext();

    const handleExport = async () => {
        if (!cityInput || !countryInput || !selectedThemeId) {
            showToast('Please enter city, country and select a theme');
            return;
        }

        setIsGenerating(true);
        setIsLoading(true);
        setLoadingMessage('Starting generation...');
        setProgress(0);

        try {
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
            });

            const result = await pollJobUntilComplete(jobId, (status: JobStatus) => {
                setProgress(status.progress);
                setLoadingMessage(status.message);
            });

            if (result.result_path) {
                const posterFilename = result.result_path.split('/').pop() || result.result_path.split('\\').pop();
                if (posterFilename) {
                    setPosterImageUrl(getPosterUrl(posterFilename));
                    setFilename(posterFilename.replace('.png', ''));
                    setExportedPosterPath(result.result_path);
                }
            }

            setIsLoading(false);
            setIsGenerating(false);
            setShowModal(true);
        } catch (error) {
            setIsLoading(false);
            setIsGenerating(false);
            showToast(`Generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <aside className="w-80 flex flex-col border-l border-[var(--border-subtle)] bg-[var(--bg-surface)] z-20 shadow-xl shrink-0">
            <div className="px-6 py-5 border-b border-[var(--border-subtle)]">
                <h2 className="text-[var(--text-primary)] text-lg font-semibold tracking-tight">Print Settings</h2>
                <p className="text-[var(--text-muted)] text-xs mt-1">Configure your output format</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                {/* Size & Orientation */}
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

                {/* Overlays */}
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
    );
};
