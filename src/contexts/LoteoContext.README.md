# LoteoContext - Guía de Uso

El `LoteoContext` te permite mantener el estado de `id_loteo` e `id_soporte` a través de toda la aplicación.

## Uso Básico

### 1. En la lista de loteos (seleccionar loteo activo)

```tsx
import { useLoteo } from '@/src/contexts/LoteoContext';

const { setCurrentLoteoId } = useLoteo();

const handleSelectLoteo = (loteoId: number) => {
  setCurrentLoteoId(loteoId);
  router.push(`/loteos/${loteoId}/(tabs)/mapa`);
};
```

### 2. En la lista de soportes (filtrar por loteo y seleccionar soporte)

```tsx
import { useLoteo } from '@/src/contexts/LoteoContext';

const { currentLoteoId, setCurrentSoporteId } = useLoteo();

// Filtrar soportes del loteo actual
const loadSoportes = async () => {
  const allSoportes = await getSoportes(db);
  const filtered = allSoportes.filter(s => s.id_loteo === currentLoteoId);
  setSoportes(filtered);
};

const handleSelectSoporte = (soporteId: number) => {
  setCurrentSoporteId(soporteId);
  router.push(`/loteos/${currentLoteoId}/(tabs)/soportes/${soporteId}`);
};
```

### 3. Al crear una cámara (usar el soporte activo)

```tsx
import { useLoteo } from '@/src/contexts/LoteoContext';

const { currentSoporteId } = useLoteo();

const handleCreate = async () => {
  await addCamara(db, {
    tipo_camara: 'A',
    condicion: 'BUENO',
    id_soporte: currentSoporteId!, // ID del soporte activo
  });
  router.back();
};
```

### 4. En el mapa (crear soporte y navegar a detalles)

```tsx
import { useLoteo } from '@/src/contexts/LoteoContext';

const { currentLoteoId } = useLoteo();

const handleCreateSoporte = async (location) => {
  const result = await addSoporte(db, {
    tipo: 'POSTE',
    latitud: location.latitude,
    longitud: location.longitude,
    id_loteo: currentLoteoId!,
  });
  
  // Navegar a detalles del soporte recién creado
  router.push(`/loteos/${currentLoteoId}/(tabs)/soportes/${result.lastInsertRowId}`);
};
```

## API

- `currentLoteoId: number | null` - ID del loteo seleccionado
- `currentSoporteId: number | null` - ID del soporte seleccionado
- `setCurrentLoteoId(id: number | null)` - Establece el loteo activo
- `setCurrentSoporteId(id: number | null)` - Establece el soporte activo

## Estructura de Navegación

El contexto se usa principalmente para:
1. **Mantener el loteo activo** al navegar entre tabs (Mapa, Soportes)
2. **Filtrar datos** por loteo en las diferentes pantallas
3. **Crear relaciones** entre entidades (ej: asociar un poste a un soporte)
4. **Navegación contextual** usando los IDs almacenados en las rutas
