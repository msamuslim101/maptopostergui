import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { MapIcon, XIcon, DownloadIcon, SettingsIcon, CheckIcon } from '../icons';

export const SettingsModal: React.FC = () => {
    const { settings, setSettings, setShowSettingsModal, showToast } = useAppContext();

    return (
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
                                showToast('Settings saved!');
                                setShowSettingsModal(false);
                            }}
                            className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        >
                            <CheckIcon /> Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
