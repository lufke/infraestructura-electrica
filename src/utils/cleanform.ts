export function cleanForm<T extends Record<string, any>>(data: T): T {
    const cleaned: Record<string, any> = {}

    for (const key in data) {
        const value = data[key]

        if (typeof value === 'string') {
            // trim y convertir string vacío -> undefined
            const trimmed = value.trim()
            cleaned[key] = trimmed === '' ? undefined : trimmed
        } else {
            // dejar números, booleanos, null, undefined tal cual
            cleaned[key] = value
        }
    }

    return cleaned as T
}
