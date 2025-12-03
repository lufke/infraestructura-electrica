export const schema = `

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS loteos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    direccion TEXT,
    propietario TEXT,
    telefono TEXT,
    correo TEXT,
    comuna TEXT,
    distribuidora TEXT,
    n_cliente TEXT,
    tension_mt REAL,
    tension_bt REAL,
    nivel_tension TEXT CHECK(nivel_tension IN ('BT','MT')),
    latitud REAL,
    longitud REAL,
    notas TEXT,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT
);

CREATE TABLE IF NOT EXISTS soportes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT CHECK(tipo IN ('POSTE','CAMARA')),
    latitud REAL,
    longitud REAL,
    altitud REAL,
    precision REAL,
    notas TEXT,
    id_loteo INTEGER NOT NULL,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY(id_loteo) REFERENCES loteos(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS postes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    altura REAL,
    material TEXT CHECK(material IN ('MADERA','CONCRETO','METAL')),
    placa TEXT,
    condicion TEXT CHECK(condicion IN ('BUENO','REGULAR','MALO')) DEFAULT 'BUENO',
    notas TEXT,
    id_soporte INTEGER NOT NULL,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY(id_soporte) REFERENCES soportes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS camaras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo_camara TEXT,
    placa TEXT,
    condicion TEXT CHECK(condicion IN ('BUENO','REGULAR','MALO')) DEFAULT 'BUENO',
    notas TEXT,
    id_soporte INTEGER NOT NULL,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY(id_soporte) REFERENCES soportes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS estructuras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nivel_tension TEXT CHECK(nivel_tension IN ('BT','MT')),
    fases INTEGER,
    material_conductor TEXT,
    descripcion TEXT,
    condicion TEXT CHECK(condicion IN ('BUENO','REGULAR','MALO')) DEFAULT 'BUENO',
    notas TEXT,
    id_soporte INTEGER NOT NULL,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY(id_soporte) REFERENCES soportes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS seccionamientos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT,
    nivel_tension TEXT CHECK(nivel_tension IN ('BT','MT')),
    fases INTEGER,
    corriente REAL,
    posicion TEXT CHECK(posicion IN ('ABIERTO','CERRADO')),
    condicion TEXT CHECK(condicion IN ('BUENO','REGULAR','MALO')) DEFAULT 'BUENO',
    letrero TEXT,
    notas TEXT,
    id_soporte INTEGER NOT NULL,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY(id_soporte) REFERENCES soportes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subestaciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    tension REAL,
    potencia REAL,
    fases INTEGER,
    marca TEXT,
    serie TEXT,
    condicion TEXT CHECK(condicion IN ('BUENO','REGULAR','MALO')) DEFAULT 'BUENO',
    letrero TEXT,
    notas TEXT,
    id_soporte INTEGER NOT NULL,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY(id_soporte) REFERENCES soportes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lineas_mt (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT,
    fases INTEGER,
    seccion REAL,
    largo REAL,
    condicion TEXT CHECK(condicion IN ('BUENO','REGULAR','MALO')) DEFAULT 'BUENO',
    id_soporte_inicio INTEGER NOT NULL,
    id_soporte_final INTEGER NOT NULL,
    notas TEXT,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY(id_soporte_inicio) REFERENCES soportes(id) ON DELETE CASCADE,
    FOREIGN KEY(id_soporte_final) REFERENCES soportes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS lineas_bt (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT,
    fases INTEGER,
    seccion REAL,
    largo REAL,
    condicion TEXT CHECK(condicion IN ('BUENO','REGULAR','MALO')) DEFAULT 'BUENO',
    notas TEXT,
    id_subestacion INTEGER NOT NULL,
    id_soporte_inicio INTEGER NOT NULL,
    id_soporte_final INTEGER NOT NULL,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY(id_subestacion) REFERENCES subestaciones(id) ON DELETE CASCADE,
    FOREIGN KEY(id_soporte_inicio) REFERENCES soportes(id) ON DELETE CASCADE,
    FOREIGN KEY(id_soporte_final) REFERENCES soportes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS empalmes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    n_medidor TEXT,
    nivel_tension TEXT CHECK(nivel_tension IN ('BT','MT')),
    fases INTEGER,
    capacidad REAL,
    direccion TEXT,
    parcela TEXT,
    activo INTEGER CHECK(activo IN (0,1)) DEFAULT 1,
    id_soporte INTEGER NOT NULL,
    id_subestacion INTEGER NOT NULL,
    notas TEXT,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY(id_soporte) REFERENCES soportes(id) ON DELETE CASCADE,
    FOREIGN KEY(id_subestacion) REFERENCES subestaciones(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS luminarias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo_lampara TEXT CHECK(tipo_lampara IN ('LED','HM','HPS')),
    potencia REAL,
    condicion TEXT CHECK(condicion IN ('BUENO','REGULAR','MALO')) DEFAULT 'BUENO',
    notas TEXT,
    id_empalme INTEGER NOT NULL,
    id_soporte INTEGER NOT NULL,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY(id_empalme) REFERENCES empalmes(id) ON DELETE CASCADE,
    FOREIGN KEY(id_soporte) REFERENCES soportes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tirantes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nivel_tension TEXT CHECK(nivel_tension IN ('BT','MT')),
    cantidad INTEGER,
    fijacion TEXT,
    tipo TEXT CHECK(tipo IN ('SIMPLE','DOBLE')),
    condicion TEXT CHECK(condicion IN ('BUENO','REGULAR','MALO')) DEFAULT 'BUENO',
    notas TEXT,
    id_soporte INTEGER NOT NULL,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY(id_soporte) REFERENCES soportes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tierras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT CHECK(tipo IN ('TP','TS')),
    resistencia REAL,
    condicion TEXT CHECK(condicion IN ('BUENO','REGULAR','MALO')) DEFAULT 'BUENO',
    notas TEXT,
    id_soporte INTEGER NOT NULL,
    sincronizado INTEGER DEFAULT 0,
    id_supabase INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    created_by TEXT,
    updated_by TEXT,
    FOREIGN KEY(id_soporte) REFERENCES soportes(id) ON DELETE CASCADE
);

`;
