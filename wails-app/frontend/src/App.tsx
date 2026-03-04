import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { TopBar } from './components/layout/TopBar';
import { SidebarLeft } from './components/layout/SidebarLeft';
import { MainCanvas } from './components/layout/MainCanvas';
import { SidebarRight } from './components/layout/SidebarRight';
import { SettingsModal } from './components/layout/SettingsModal';
import { ExportModal } from './components/layout/ExportModal';
import { CheckCircleIcon } from './components/icons';

const AppContent = () => {
    const { showModal, showSettingsModal, toastMessage } = useAppContext();

    return (
        <div className="bg-[var(--bg-base)] text-[var(--text-primary)] h-screen w-screen overflow-hidden flex flex-col selection:bg-[var(--accent-primary)] selection:text-[var(--bg-base)] selection:bg-opacity-30 font-['Inter',sans-serif]">
            {/* TITLE BAR */}
            <TopBar />

            {/* MAIN CONTENT ROW */}
            <div className="flex-1 flex overflow-hidden">
                <SidebarLeft />
                <MainCanvas />
                <SidebarRight />
            </div>

            {/* Modals */}
            {showModal && <ExportModal />}
            {showSettingsModal && <SettingsModal />}

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
    );
};

function App() {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App;
