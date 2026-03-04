import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { XIcon, CheckCircleIcon, FolderIcon, CopyIcon, DownloadIcon, PlusIcon } from '../icons';
import { OpenFolder, ShowSaveDialog, SaveFile } from '../../../wailsjs/go/main/App';

export const ExportModal: React.FC = () => {
    const {
        setShowModal, cityInput, exportedPosterPath, filename, posterImageUrl,
        showToast, copyToClipboard, setSelectedThemeId, setShowPreview,
        setCityInput, setCountryInput, setPosterImageUrl, setExportedPosterPath,
        setZoomLevel, setFilename, setDistance
    } = useAppContext();

    const closeModal = () => setShowModal(false);

    const handleReset = () => {
        closeModal();
        setSelectedThemeId(null);
        setShowPreview(false);
        setCityInput('');
        setCountryInput('');
        setPosterImageUrl(null);
        setExportedPosterPath(null);
        setZoomLevel(100);
        setFilename('');
        setDistance(15000);
    };

    const handleOpenFolder = async () => {
        if (exportedPosterPath) {
            try {
                // Wails: open folder in file explorer
                await OpenFolder(exportedPosterPath);
                showToast('Opened in File Explorer');
            } catch {
                // Web fallback: copy path to clipboard
                copyToClipboard(exportedPosterPath);
            }
        }
        closeModal();
    };

    const handleDownload = async () => {
        if (!posterImageUrl) return;

        try {
            // Use native save dialog (Wails)
            const defaultName = `${filename || 'map_poster'}.png`;
            const savePath = await ShowSaveDialog(defaultName);

            if (savePath) {
                const success = await SaveFile(posterImageUrl, savePath);
                if (success) {
                    showToast(`Saved to ${savePath}`);
                    setExportedPosterPath(savePath);
                } else {
                    showToast('Save failed');
                }
            }
        } catch {
            // Web fallback: browser download
            try {
                const response = await fetch(posterImageUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filename || 'map_poster'}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                showToast('Download started!');
            } catch {
                showToast('Download failed');
            }
        }
    };

    return (
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
    );
};
