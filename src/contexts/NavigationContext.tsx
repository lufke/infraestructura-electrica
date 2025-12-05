import React, { createContext, ReactNode, useContext, useState } from 'react';

interface NavigationContextType {
    currentLoteoId: number | null;
    currentSoporteId: number | null;
    setCurrentLoteoId: (id: number | null) => void;
    setCurrentSoporteId: (id: number | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
    children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
    const [currentLoteoId, setCurrentLoteoId] = useState<number | null>(null);
    const [currentSoporteId, setCurrentSoporteId] = useState<number | null>(null);

    return (
        <NavigationContext.Provider
            value={{
                currentLoteoId,
                currentSoporteId,
                setCurrentLoteoId,
                setCurrentSoporteId,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
}

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within NavigationProvider');
    }
    return context;
};
