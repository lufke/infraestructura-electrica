import { sql } from 'drizzle-orm';
import { check, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
    ACTIVO_VALUES,
    CONDICION_VALUES,
    FIJACION_TIRANTE_VALUES,
    MATERIAL_POSTE_VALUES,
    NIVEL_TENSION_VALUES,
    POSICION_SECCIONAMIENTO_VALUES,
    sqlIn,
    TIPO_LAMPARA_VALUES,
    TIPO_SOPORTE_VALUES,
    TIPO_TIERRA_VALUES,
    TIPO_TIRANTE_VALUES
} from './constants';

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
    nivelTensionCheck: check('nivel_tension_check', sql`${table.nivel_tension} IN (${sql.raw(sqlIn(NIVEL_TENSION_VALUES))})`)
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
    tipoCheck: check('tipo_check', sql`${table.tipo} IN (${sql.raw(sqlIn(TIPO_SOPORTE_VALUES))})`)
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
    alturaNivelTensionCheck: check('altura_nivel_tension_check', sql`${table.altura_nivel_tension} IN (${sql.raw(sqlIn(NIVEL_TENSION_VALUES))})`),
    materialCheck: check('material_check', sql`${table.material} IN (${sql.raw(sqlIn(MATERIAL_POSTE_VALUES))})`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN (${sql.raw(sqlIn(CONDICION_VALUES))})`)
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
    condicionCheck: check('condicion_check', sql`${table.condicion} IN (${sql.raw(sqlIn(CONDICION_VALUES))})`)
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
    nivelTensionCheck: check('nivel_tension_check', sql`${table.nivel_tension} IN (${sql.raw(sqlIn(NIVEL_TENSION_VALUES))})`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN (${sql.raw(sqlIn(CONDICION_VALUES))})`)
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
    nivelTensionCheck: check('nivel_tension_check', sql`${table.nivel_tension} IN (${sql.raw(sqlIn(NIVEL_TENSION_VALUES))})`),
    posicionCheck: check('posicion_check', sql`${table.posicion} IN (${sql.raw(sqlIn(POSICION_SECCIONAMIENTO_VALUES))})`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN (${sql.raw(sqlIn(CONDICION_VALUES))})`)
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
    condicionCheck: check('condicion_check', sql`${table.condicion} IN (${sql.raw(sqlIn(CONDICION_VALUES))})`)
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
    nivelTensionCheck: check('nivel_tension_check', sql`${table.nivel_tension} IN (${sql.raw(sqlIn(NIVEL_TENSION_VALUES))})`),
    fijacionCheck: check('fijacion_check', sql`${table.fijacion} IN (${sql.raw(sqlIn(FIJACION_TIRANTE_VALUES))})`),
    tipoCheck: check('tipo_check', sql`${table.tipo} IN (${sql.raw(sqlIn(TIPO_TIRANTE_VALUES))})`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN (${sql.raw(sqlIn(CONDICION_VALUES))})`)
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
    tipoCheck: check('tipo_check', sql`${table.tipo} IN (${sql.raw(sqlIn(TIPO_TIERRA_VALUES))})`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN (${sql.raw(sqlIn(CONDICION_VALUES))})`)
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
    nivelTensionCheck: check('nivel_tension_check', sql`${table.nivel_tension} IN (${sql.raw(sqlIn(NIVEL_TENSION_VALUES))})`),
    activoCheck: check('activo_check', sql`${table.activo} IN (${sql.raw(sqlIn(ACTIVO_VALUES))})`)
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
    tipoLamparaCheck: check('tipo_lampara_check', sql`${table.tipo_lampara} IN (${sql.raw(sqlIn(TIPO_LAMPARA_VALUES))})`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN (${sql.raw(sqlIn(CONDICION_VALUES))})`)
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
    materialCheck: check('material_check', sql`${table.material} IN (${sql.raw(sqlIn(MATERIAL_LINEA_VALUES))})`),
    aislacionCheck: check('aislacion_check', sql`${table.aislacion} IN (${sql.raw(sqlIn(AISLACION_LINEA_VALUES))})`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN (${sql.raw(sqlIn(CONDICION_VALUES))})`)
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
    materialCheck: check('material_check', sql`${table.material} IN (${sql.raw(sqlIn(MATERIAL_LINEA_VALUES))})`),
    aislacionCheck: check('aislacion_check', sql`${table.aislacion} IN (${sql.raw(sqlIn(AISLACION_LINEA_VALUES))})`),
    condicionCheck: check('condicion_check', sql`${table.condicion} IN (${sql.raw(sqlIn(CONDICION_VALUES))})`)
}));
