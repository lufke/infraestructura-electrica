Aplicacion para gestionar la infraestructura electrica de loteos

Se trata de una aplicacion para gestionar la infraestructura electrica de loteos
En cada loteo se pueden gestionar los soportes, postes, camaras, estructuras, seccionamientos, subestaciones, lineas mt, lineas bt, empalmes, tierras, tirantes, medidores, etc.

La aplicacion esta en desarrollo y se encuentra en etapa alpha.

Un loteo es un terreno en el que hay una red de distribucion electrica
La red de distribucion electrica se compone de:

- Soporte: Punto geográfico con el cual se relacionan los componentes del sistema, está asociado al loteo
- Poste: Elemento estructural que soporta los conductores, estructuras, seccionamientos, subestaciones, lineas mt, lineas bt, empalmes, tierras, tirantes, medidores, etc. 
- Camara: Caja que contiene los conductores
- Estructura: Elemento estructural que soporta los conductores, seccionamientos, subestaciones, lineas mt, lineas bt, empalmes, tierras, tirantes, medidores, etc. Va asociado al soporte donde está instalado
- Seccionamiento: Elemento que divide la linea en secciones, va asociada al soporte
- Subestacion: Elemento electrico que modifica el voltaje de media tension a baja tension, puede estar relacionado a 1, 2 o 4 soportes, pero por simplicidad, será asociado a un soporte.
- Linea MT: Elemento que conduce la electricidad en media tension. Esta asociado a dos soportes, uno inicial y uno final.
- Linea BT: Elemento que conduce la electricidad en baja tension. Esta asociado a dos soportes, uno inicial y uno final.
- Empalme: Elemento que asocia un cliente en baja tension a la subestacion (si el loteo tiene subestaciones) y al soporte donde está conectado.
- Tierra: Elemento de seguridad de la red, asociado a un soporte donde está instalado.
- Tirante: Elemento fisico para sujetar los postes, asociado al soporte donde está instalado
- Luminaria: Elemento que ilumina un area, asociado a un soporte donde está instalado y posiblemente a un empalme


Relaciones
Loteo
Soporte -> Loteo
Poste -> Soporte
Camara -> Soporte
Estructura -> Soporte
Seccionamiento -> Soporte
Subestacion -> Soporte
Linea MT -> Soporte 
Linea BT -> Soporte
Empalme -> Soporte y ¿Subestacion?
Tierra -> Soporte
Tirante -> Soporte
Luminaria -> Soporte y ¿Empalme?

Se desea que al iniciar la aplicacion entre a una pantalla que incialmente será un boton para pasar a la pantalla de listado de loteos. Esto despues se cambiara a un login / register
Al elegir un loteo, se avanza a una pantalla con un TabView (barra inferior con 2 tabs: mapa y lista):
-Tab Mapa: un mapa con el loteo seleccionado y los soportes del loteo y sus lineas. En la pantalla del mapa, habrá un boton para crear un nuevo soporte, cuyas coordenadas serán obtenidas por el GPS.
Al crear el soporte, se entrará en una pantalla donde se deberán agregar los distintos elementos que puede tener un soporte, como postes, camaras, estructuras, seccionamientos, subestaciones, empalmes, tierras, tirantes, luminarias, etc.
AL presionar un soporte en el mapa, nos debe dar la opcion de crear una linea eligiendo ese punto como soporte de inicio y elegir otro soporte para que sea soporte final del tramo y poder agragar las caracteristicas de la linea (material, largo, seccion, etc). Dependiendo si es posible hacerlo así, sino, ver otra forma de hacerlo.
-Tab Lista: Listado de soportes del loteo seleccionado, donde se mostrara el poste o camara asociada a cada soporte.
-Tab Subestaciones: Listado de subestaciones del loteo seleccionado.
-Tab Seccionamientos: Listado de seccionamientos del loteo seleccionado.

Se puede crear un filtro para que el mapa solo muestre lineas BT, lineas MT, luminarias, etc. 

La informacion se guardara en una base de datos local (SQLite) y posteriormente se subirá a supabase (para lo cual se necesita implementar un sistema de registro de usuarios).

Inicialmente se manejará la sincronizacion solo con un campo llamado sincronizado que será un booleano que indica si el registro se ha sincronizado con supabase o no. Posteriormente se verá una forma mas eficiente de sincronizar los datos.

