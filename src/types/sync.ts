export interface SyncData {
    synced: number
    id_supabase?: string | number
    deleted: number
    created_at: string
    updated_at: string
    deleted_at?: string
    deleted_by?: string
    created_by?: string
    updated_by?: string
}