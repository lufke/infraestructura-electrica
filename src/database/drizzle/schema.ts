import { check, sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// --------------------------------------------------------------------------
// Loteos
// --------------------------------------------------------------------------
export const loteos = sqliteTable('loteos', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    nombre: text('nombre').notNull(),
    direccion: text('direccion'),
    propietario: text('propietario'),
    id_owner: text('id_owner'),
    telefono: text('telefono'),
    correo: text('correo'),
    comuna: text('comuna'),
    distribuidora: text('distribuidora'),
    n_cliente: text('n_cliente'),
    tension_mt: real('tension_mt'),
    tension_bt: real('tension_bt'),
    nivel_tension: text('nivel_tension'),
    latitud: real('latitud'),
    longitud: real('longitud'),
    notas: text('notas'),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    nivelTensionCheck: check('nivel_tension_check', sql`${table.nivel_tension} IN ('BT','MT')`)
}));

// --------------------------------------------------------------------------
// Soportes (Base for Postes, Camaras, etc.)
// --------------------------------------------------------------------------
export const soportes = sqliteTable('soportes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    tipo: text('tipo'),
    latitud: real('latitud'),
    longitud: real('longitud'),
    altitud: real('altitud'),
    precision: real('precision'),
    notas: text('notas'),
    id_loteo: integer('id_loteo').notNull().references(() => loteos.id, { onDelete: 'cascade' }),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    tipoCheck: check('tipo_check', sql`${table.tipo} IN ('POSTE','CAMARA')`)
}));

// --------------------------------------------------------------------------
// Support Subtypes
// --------------------------------------------------------------------------
export const postes = sqliteTable('postes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    altura: real('altura'),
    altura_nivel_tension: text('altura_nivel_tension'),
    material: text('material'),
    placa: text('placa'),
    condicion: text('condicion').default('BUENO'),
    notas: text('notas'),
    id_soporte: integer('id_soporte').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    alturaNivelTensionCheck: check('altura_nivel_tension_check', sql`${table.altura_nivel_tension} IN ('MT','BT')`),
    materialCheck: check('material_check', sql`${table.material} IN ('MADERA','CONCRETO','METAL')`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN ('BUENO','REGULAR','MALO')`)
}));

export const camaras = sqliteTable('camaras', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    tipo_camara: text('tipo_camara'),
    placa: text('placa'),
    condicion: text('condicion').default('BUENO'),
    notas: text('notas'),
    id_soporte: integer('id_soporte').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    condicionCheck: check('condicion_check', sql`${table.condicion} IN ('BUENO','REGULAR','MALO')`)
}));

export const estructuras = sqliteTable('estructuras', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    nivel_tension: text('nivel_tension'),
    fases: integer('fases'),
    material_conductor: text('material_conductor'),
    descripcion: text('descripcion'),
    condicion: text('condicion').default('BUENO'),
    notas: text('notas'),
    id_soporte: integer('id_soporte').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    nivelTensionCheck: check('nivel_tension_check', sql`${table.nivel_tension} IN ('BT','MT')`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN ('BUENO','REGULAR','MALO')`)
}));

export const seccionamientos = sqliteTable('seccionamientos', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    tipo: text('tipo'),
    nivel_tension: text('nivel_tension'),
    fases: integer('fases'),
    corriente: real('corriente'),
    posicion: text('posicion'),
    condicion: text('condicion').default('BUENO'),
    letrero: text('letrero'),
    notas: text('notas'),
    id_soporte: integer('id_soporte').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    nivelTensionCheck: check('nivel_tension_check', sql`${table.nivel_tension} IN ('BT','MT')`),
    posicionCheck: check('posicion_check', sql`${table.posicion} IN ('ABIERTO','CERRADO')`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN ('BUENO','REGULAR','MALO')`)
}));

export const subestaciones = sqliteTable('subestaciones', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    nombre: text('nombre'),
    tension: real('tension'),
    potencia: real('potencia'),
    fases: integer('fases'),
    marca: text('marca'),
    serie: text('serie'),
    condicion: text('condicion').default('BUENO'),
    letrero: text('letrero'),
    notas: text('notas'),
    id_soporte: integer('id_soporte').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    condicionCheck: check('condicion_check', sql`${table.condicion} IN ('BUENO','REGULAR','MALO')`)
}));

export const tirantes = sqliteTable('tirantes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    nivel_tension: text('nivel_tension'),
    cantidad: integer('cantidad'),
    fijacion: text('fijacion'),
    tipo: text('tipo'),
    condicion: text('condicion').default('BUENO'),
    notas: text('notas'),
    id_soporte: integer('id_soporte').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    nivelTensionCheck: check('nivel_tension_check', sql`${table.nivel_tension} IN ('BT','MT')`),
    fijacionCheck: check('fijacion_check', sql`${table.fijacion} IN ('PISO','POSTE MOZO','RIEL')`),
    tipoCheck: check('tipo_check', sql`${table.tipo} IN ('SIMPLE','DOBLE')`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN ('BUENO','REGULAR','MALO')`)
}));

export const tierras = sqliteTable('tierras', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    tipo: text('tipo'),
    resistencia: real('resistencia'),
    condicion: text('condicion').default('BUENO'),
    notas: text('notas'),
    id_soporte: integer('id_soporte').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    tipoCheck: check('tipo_check', sql`${table.tipo} IN ('TP','TS')`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN ('BUENO','REGULAR','MALO')`)
}));

// --------------------------------------------------------------------------
// Network Elements
// --------------------------------------------------------------------------
export const empalmes = sqliteTable('empalmes', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    n_medidor: text('n_medidor'),
    nivel_tension: text('nivel_tension'),
    fases: integer('fases'),
    capacidad: real('capacidad'),
    direccion: text('direccion'),
    parcela: text('parcela'),
    activo: integer('activo').default(1),
    id_soporte: integer('id_soporte').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    id_subestacion: integer('id_subestacion').references(() => subestaciones.id, { onDelete: 'cascade' }),
    notas: text('notas'),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    nivelTensionCheck: check('nivel_tension_check', sql`${table.nivel_tension} IN ('BT','MT')`),
    activoCheck: check('activo_check', sql`${table.activo} IN (0,1)`)
}));

export const luminarias = sqliteTable('luminarias', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    tipo_lampara: text('tipo_lampara'),
    potencia: real('potencia'),
    condicion: text('condicion').default('BUENO'),
    notas: text('notas'),
    id_empalme: integer('id_empalme').notNull().references(() => empalmes.id, { onDelete: 'cascade' }),
    id_soporte: integer('id_soporte').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    tipoLamparaCheck: check('tipo_lampara_check', sql`${table.tipo_lampara} IN ('LED','HM','HPS')`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN ('BUENO','REGULAR','MALO')`)
}));

export const lineas_mt = sqliteTable('lineas_mt', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    material: text('material'),
    aislacion: text('aislacion'),
    tipo: text('tipo'),
    fases: integer('fases'),
    seccion: real('seccion'),
    largo: real('largo'),
    condicion: text('condicion').default('BUENO'),
    id_soporte_inicio: integer('id_soporte_inicio').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    id_soporte_final: integer('id_soporte_final').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    notas: text('notas'),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    materialCheck: check('material_check', sql`${table.material} IN ('ALUMINIO','COBRE')`),
    aislacionCheck: check('aislacion_check', sql`${table.aislacion} IN ('DESNUDO','AISLADO')`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN ('BUENO','REGULAR','MALO')`)
}));

export const lineas_bt = sqliteTable('lineas_bt', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    material: text('material'),
    aislacion: text('aislacion'),
    tipo: text('tipo'),
    fases: integer('fases'),
    seccion: real('seccion'),
    largo: real('largo'),
    condicion: text('condicion').default('BUENO'),
    notas: text('notas'),
    id_subestacion: integer('id_subestacion').references(() => subestaciones.id, { onDelete: 'cascade' }),
    id_soporte_inicio: integer('id_soporte_inicio').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    id_soporte_final: integer('id_soporte_final').notNull().references(() => soportes.id, { onDelete: 'cascade' }),
    synced: integer('synced').default(0),
    id_supabase: integer('id_supabase'),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
    deleted: integer('deleted').default(0),
    created_by: text('created_by'),
    updated_by: text('updated_by')
}, (table) => ({
    materialCheck: check('material_check', sql`${table.material} IN ('ALUMINIO','COBRE')`),
    aislacionCheck: check('aislacion_check', sql`${table.aislacion} IN ('DESNUDO','AISLADO')`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN ('BUENO','REGULAR','MALO')`)
}));
