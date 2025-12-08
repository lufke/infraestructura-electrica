import React, { createContext, ReactNode, useContext, useState } from 'react';

interface LoteoContextType {
    currentLoteoId: number | null;
    currentSoporteId: number | null;
    setCurrentLoteoId: (id: number | null) => void;
    setCurrentSoporteId: (id: number | null) => void;
}

const LoteoContext = createContext<LoteoContextType | undefined>(undefined);

interface LoteoProviderProps {
    children: ReactNode;
}

export function LoteoProvider({ children }: LoteoProviderProps) {
    const [currentLoteoId, setCurrentLoteoId] = useState<number | null>(null);
    const [currentSoporteId, setCurrentSoporteId] = useState<number | null>(null);

    return (
        <LoteoContext.Provider
            value={{
                currentLoteoId,
                currentSoporteId,
                setCurrentLoteoId,
                setCurrentSoporteId,
            }}
        >
            {children}
        </LoteoContext.Provider>
    );
}

export const useLoteo = () => {
    const context = useContext(LoteoContext);
    if (!context) {
        throw new Error('useLoteo must be used within LoteoProvider');
    }
    return context;
};
