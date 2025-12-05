import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-paper'

interface NumericInputProps {
    label?: string
    value?: number | undefined
    onChange: (value: number | undefined) => void
    style?: any
    mode?: 'outlined' | 'flat'
    inputMode?: 'decimal' | 'numeric'
    keyboardType?: 'numeric' | 'decimal-pad'
}

const NumericInput: React.FC<NumericInputProps> = ({
    label,
    value,
    onChange,
    style,
    mode = 'outlined',
    inputMode = 'decimal',
    keyboardType = 'decimal-pad',
}) => {

    const [textValue, setTextValue] = useState(value !== undefined ? value.toString() : '')

    useEffect(() => {
        if (value !== undefined) {
            setTextValue(value.toString())
        }
    }, [value])

    const handleTextChange = (text: string) => {
        // Permitir números, '-', '.' y ','
        let cleaned = text.replace(/[^0-9.,-]/g, "")

        // Evitar más de un "-"
        const minusCount = (cleaned.match(/-/g) || []).length
        if (minusCount > 1) {
            cleaned = cleaned.replace(/-/g, (match, offset) => (offset === 0 ? '-' : ''))
        }

        // El "-" solo válido si es el primer carácter
        if (cleaned.includes("-") && cleaned[0] !== "-") {
            cleaned = cleaned.replace(/-/g, "")
        }

        setTextValue(cleaned)

        // Normalizar coma
        const normalized = cleaned.replace(",", ".")

        // Intentar convertir a número válido
        const num = parseFloat(normalized)

        // Casos que NO deben pasar número aún:
        // "-", ".", "-.", "12." → debe seguir mostrando texto sin convertir
        const invalidNumericPatterns = /^-?$|^\.$|^-\.$|^[0-9]+\.$/
        if (invalidNumericPatterns.test(normalized)) {
            onChange(undefined)
            return
        }

        if (!isNaN(num)) {
            onChange(num)
        } else {
            onChange(undefined)
        }
    }

    return (
        <TextInput
            label={label}
            value={textValue}
            onChangeText={handleTextChange}
            mode={mode}
            style={style}
            inputMode={inputMode}
            keyboardType={keyboardType}
        />
    )
}

export default NumericInput
