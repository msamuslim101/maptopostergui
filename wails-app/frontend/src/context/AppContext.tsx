import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchThemes, type Theme as APITheme } from '../api/client';
import { IsLegacyMode } from '../../wailsjs/go/main/App';

export interface Settings {
    defaultDpi: string;
    saveLocation: string;
    hardwareAcceleration: boolean;
}

interface AppContextType {
    cityInput: string;
    setCityInput: (val: string) => void;
    countryInput: string;
    setCountryInput: (val: string) => void;
    selectedThemeId: string | null;
    setSelectedThemeId: (val: string | null) => void;
    isLoading: boolean;
    setIsLoading: (val: boolean) => void;
    loadingMessage: string;
    setLoadingMessage: (val: string) => void;
    progress: number;
    setProgress: (val: number) => void;
    showPreview: boolean;
    setShowPreview: (val: boolean) => void;
    showModal: boolean;
    setShowModal: (val: boolean) => void;
    orientation: 'portrait' | 'landscape';
    setOrientation: (val: 'portrait' | 'landscape') => void;
    showCityName: boolean;
    setShowCityName: (val: boolean) => void;
    showCountryName: boolean;
    setShowCountryName: (val: boolean) => void;
    showCoordinates: boolean;
    setShowCoordinates: (val: boolean) => void;
    filename: string;
    setFilename: (val: string) => void;
    posterImageUrl: string | null;
    setPosterImageUrl: (val: string | null) => void;
    apiThemes: APITheme[];
    setApiThemes: (val: APITheme[]) => void;
    backendConnected: boolean;
    setBackendConnected: (val: boolean) => void;
    distance: number;
    setDistance: (val: number) => void;
    posterSize: string;
    setPosterSize: (val: string) => void;
    zoomLevel: number;
    setZoomLevel: (val: number | ((prev: number) => number)) => void;
    showSettingsModal: boolean;
    setShowSettingsModal: (val: boolean) => void;
    toastMessage: string | null;
    setToastMessage: (val: string | null) => void;
    exportedPosterPath: string | null;
    setExportedPosterPath: (val: string | null) => void;
    isGenerating: boolean;
    setIsGenerating: (val: boolean) => void;
    legacyMode: boolean;
    setLegacyMode: (val: boolean) => void;
    settings: Settings;
    setSettings: (val: Settings) => void;
    showToast: (msg: string) => void;
    copyToClipboard: (text: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [cityInput, setCityInput] = useState('');
    const [countryInput, setCountryInput] = useState('');
    const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [showCityName, setShowCityName] = useState(true);
    const [showCountryName, setShowCountryName] = useState(true);
    const [showCoordinates, setShowCoordinates] = useState(true);
    const [filename, setFilename] = useState('');
    const [posterImageUrl, setPosterImageUrl] = useState<string | null>(null);
    const [apiThemes, setApiThemes] = useState<APITheme[]>([]);
    const [backendConnected, setBackendConnected] = useState(false);
    const [distance, setDistance] = useState(15000);
    const [posterSize, setPosterSize] = useState('18x24');

    const [zoomLevel, setZoomLevel] = useState(100);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [exportedPosterPath, setExportedPosterPath] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [legacyMode, setLegacyMode] = useState(false);

    const [settings, setSettings] = useState<Settings>(() => {
        const saved = localStorage.getItem('maptoposter_settings');
        return saved ? JSON.parse(saved) : {
            defaultDpi: '300',
            saveLocation: 'posters',
            hardwareAcceleration: true
        };
    });

    useEffect(() => {
        localStorage.setItem('maptoposter_settings', JSON.stringify(settings));
    }, [settings]);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            showToast('Path copied to clipboard!');
        } catch {
            showToast('Failed to copy');
        }
    };

    useEffect(() => {
        let isCancelled = false;

        const connectToBackend = async () => {
            while (!isCancelled) {
                try {
                    const themes = await fetchThemes();
                    if (!isCancelled) {
                        setApiThemes(themes);
                        setBackendConnected(true);
                        break; // Exit loop on success
                    }
                } catch {
                    if (!isCancelled) {
                        setBackendConnected(false);
                        // Retry after 2 seconds
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                }
            }
        };

        connectToBackend();

        IsLegacyMode()
            .then(enabled => { if (!isCancelled) setLegacyMode(enabled); })
            .catch(() => { if (!isCancelled) setLegacyMode(false); });

        return () => {
            isCancelled = true;
        };
    }, []);

    const value = {
        cityInput, setCityInput,
        countryInput, setCountryInput,
        selectedThemeId, setSelectedThemeId,
        isLoading, setIsLoading,
        loadingMessage, setLoadingMessage,
        progress, setProgress,
        showPreview, setShowPreview,
        showModal, setShowModal,
        orientation, setOrientation,
        showCityName, setShowCityName,
        showCountryName, setShowCountryName,
        showCoordinates, setShowCoordinates,
        filename, setFilename,
        posterImageUrl, setPosterImageUrl,
        apiThemes, setApiThemes,
        backendConnected, setBackendConnected,
        distance, setDistance,
        posterSize, setPosterSize,
        zoomLevel, setZoomLevel,
        showSettingsModal, setShowSettingsModal,
        toastMessage, setToastMessage,
        exportedPosterPath, setExportedPosterPath,
        isGenerating, setIsGenerating,
        legacyMode, setLegacyMode,
        settings, setSettings,
        showToast, copyToClipboard
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
