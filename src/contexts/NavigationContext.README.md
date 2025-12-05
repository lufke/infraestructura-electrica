# NavigationContext - Guía de Uso

El `NavigationContext` te permite mantener el estado de `id_loteo` e `id_soporte` a través de toda la aplicación.

## Uso Básico

### 1. En la lista de loteos (seleccionar loteo activo)

```tsx
import { useNavigation } from '@/src/contexts/NavigationContext';

const { setCurrentLoteoId } = useNavigation();

const handleSelectLoteo = (loteoId: number) => {
  setCurrentLoteoId(loteoId);
  router.push(`/loteos/${loteoId}/soportes`);
};
```

### 2. En la lista de soportes (filtrar por loteo y seleccionar soporte)

```tsx
import { useNavigation } from '@/src/contexts/NavigationContext';

const { currentLoteoId, setCurrentSoporteId } = useNavigation();

// Filtrar soportes del loteo actual
const loadSoportes = async () => {
  const allSoportes = await getSoportes(db);
  const filtered = allSoportes.filter(s => s.id_loteo === currentLoteoId);
  setSoportes(filtered);
};

const handleSelectSoporte = (soporteId: number) => {
  setCurrentSoporteId(soporteId);
  router.push(`/soportes/${soporteId}/camaras`);
};
```

### 3. Al crear una cámara (usar el soporte activo)

```tsx
import { useNavigation } from '@/src/contexts/NavigationContext';

const { currentSoporteId } = useNavigation();

const handleCreate = async () => {
  await addCamara(db, {
    tipo_camara: 'A',
    condicion: 'BUENO',
    id_soporte: currentSoporteId!, // ID del soporte activo
  });
  router.back();
};
```

## API

- `currentLoteoId: number | null` - ID del loteo seleccionado
- `currentSoporteId: number | null` - ID del soporte seleccionado
- `setCurrentLoteoId(id: number | null)` - Establece el loteo activo
- `setCurrentSoporteId(id: number | null)` - Establece el soporte activo
