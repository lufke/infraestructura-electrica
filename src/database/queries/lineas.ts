// src/database/queries/lineas.ts
import { SQLiteDatabase } from "expo-sqlite";
import { getLineasBTConSoportes } from "./lineas_bt";
import { getLineasMTConSoportes } from "./lineas_mt";

// Obtener todas las líneas (BT y MT) con información de coordenadas
export async function getAllLineasConSoportes(db: SQLiteDatabase, id_loteo: number) {
    try {
        const [lineasBt, lineasMt] = await Promise.all([
            getLineasBTConSoportes(db, id_loteo),
            getLineasMTConSoportes(db, id_loteo)
        ]);

        // Combinar y transformar los resultados
        const todasLasLineas = [
            ...(lineasBt as any[]).map(l => ({
                ...l,
                nivel_tension: 'BT' as const
            })),
            ...(lineasMt as any[]).map(l => ({
                ...l,
                nivel_tension: 'MT' as const
            }))
        ];

        return todasLasLineas;
    } catch (error) {
        console.error("Error cargando todas las líneas:", error);
        return [];
    }
}

// Obtener líneas por tipo
export async function getLineasByTension(db: SQLiteDatabase, id_loteo: number, nivel_tension: 'BT' | 'MT') {
    if (nivel_tension === 'BT') {
        return getLineasBTConSoportes(db, id_loteo);
    } else {
        return getLineasMTConSoportes(db, id_loteo);
    }
}

// Obtener líneas que conectan con un soporte específico
export async function getLineasBySoporteId(db: SQLiteDatabase, id_soporte: number) {
    const sql = `
        SELECT 
            'BT' as nivel_tension,
            lb.*,
            s_inicio.latitud as inicio_latitud,
            s_inicio.longitud as inicio_longitud,
            s_final.latitud as final_latitud,
            s_final.longitud as final_longitud
        FROM lineas_bt lb
        INNER JOIN soportes s_inicio ON lb.id_soporte_inicio = s_inicio.id
        INNER JOIN soportes s_final ON lb.id_soporte_final = s_final.id
        WHERE (lb.id_soporte_inicio = ? OR lb.id_soporte_final = ?)
        AND lb.deleted = 0
        
        UNION ALL
        
        SELECT 
            'MT' as nivel_tension,
            lm.*,
            s_inicio.latitud as inicio_latitud,
            s_inicio.longitud as inicio_longitud,
            s_final.latitud as final_latitud,
            s_final.longitud as final_longitud
        FROM lineas_mt lm
        INNER JOIN soportes s_inicio ON lm.id_soporte_inicio = s_inicio.id
        INNER JOIN soportes s_final ON lm.id_soporte_final = s_final.id
        WHERE (lm.id_soporte_inicio = ? OR lm.id_soporte_final = ?)
        AND lm.deleted = 0
    `;

    return await db.getAllAsync(sql, [id_soporte, id_soporte, id_soporte, id_soporte]);
}

// Obtener estadísticas de líneas
export async function getLineasStats(db: SQLiteDatabase, id_loteo: number) {
    const sql = `
        SELECT 
            'BT' as nivel_tension,
            COUNT(*) as total,
            SUM(CASE WHEN condicion = 'BUENO' THEN 1 ELSE 0 END) as buenas,
            SUM(CASE WHEN condicion = 'REGULAR' THEN 1 ELSE 0 END) as regulares,
            SUM(CASE WHEN condicion = 'MALO' THEN 1 ELSE 0 END) as malas,
            COALESCE(SUM(largo), 0) as total_largo
        FROM lineas_bt lb
        INNER JOIN soportes s_inicio ON lb.id_soporte_inicio = s_inicio.id
        INNER JOIN soportes s_final ON lb.id_soporte_final = s_final.id
        WHERE s_inicio.id_loteo = ? 
        AND s_final.id_loteo = ?
        AND lb.deleted = 0
        
        UNION ALL
        
        SELECT 
            'MT' as nivel_tension,
            COUNT(*) as total,
            SUM(CASE WHEN condicion = 'BUENO' THEN 1 ELSE 0 END) as buenas,
            SUM(CASE WHEN condicion = 'REGULAR' THEN 1 ELSE 0 END) as regulares,
            SUM(CASE WHEN condicion = 'MALO' THEN 1 ELSE 0 END) as malas,
            COALESCE(SUM(largo), 0) as total_largo
        FROM lineas_mt lm
        INNER JOIN soportes s_inicio ON lm.id_soporte_inicio = s_inicio.id
        INNER JOIN soportes s_final ON lm.id_soporte_final = s_final.id
        WHERE s_inicio.id_loteo = ? 
        AND s_final.id_loteo = ?
        AND lm.deleted = 0
    `;

    return await db.getAllAsync(sql, [id_loteo, id_loteo, id_loteo, id_loteo]);
}