export interface NivelTension {
    nivel: 'BT' | 'MT' | string
}

export interface TipoCamara {
    tipo: 'A' | 'B' | 'C' | string
}

export interface Condicion {
    condicion: 'BUENO' | 'REGULAR' | 'MALO' | string
}

export interface TipoLampara {
    tipo: 'LED' | 'HM' | 'HPS' | string
}

export interface MaterialPoste {
    material: 'MADERA' | 'CONCRETO' | 'METAL' | string
}

export interface TipoSoporte {
    tipo: 'POSTE' | 'CAMARA' | string
}

export interface TipoTierra {
    tipo: 'TP' | 'TS' | string
}

export interface TipoTirante {
    tipo: 'SIMPLE' | 'DOBLE' | string
}

export interface FijacionTirante {
    fijacion: 'PISO' | 'POSTE MOZO' | 'RIEL' | string
}

export interface MaterialConductor {
    material: 'ALUMINIO' | 'COBRE' | string
}
