import React from 'react';
import { Minimize, Maximize, Close } from '../../../wailsjs/go/main/App';
import { MapIcon } from '../icons';
import { useAppContext } from '../../context/AppContext';

export const TopBar: React.FC = () => {
    const { legacyMode } = useAppContext();

    if (legacyMode) return null;

    return (
        <div className="h-[40px] flex items-center justify-between px-4 bg-[var(--bg-surface)]/50 border-b border-[var(--border-subtle)] select-none draggable-region z-50">
            <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                <span className="text-[var(--accent-primary)]"><MapIcon /></span>
                <span>MapToPoster</span>
            </div>
            <div className="flex items-center gap-4">
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
    );
};
