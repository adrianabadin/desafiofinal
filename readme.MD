# Primera entrega desafio final CoderHouse

## Scripts
npm run dev (Corre entorno de desarrollo de TypesCript con Live reload)
npm run build (Compila el trabajo para produccion)

## Dependencias 
* Colors
* Express
* Multer

## Dependencias de Desarrollo
* Typescript
* Ts-node-dev
* Ts-Standard
* @types/express
* @types/Multer

## Porque TypeScript?
Desarrolle la API en TS porque queria empezar a desarrollar en este SuperConjunto de JS y me gustaria que el trabajo final este hecho de esta manera, asi que mientras antes arranque a entender esta herramienta mejor.

## Porque Multer?
Quise implementar la mayor cantidad de conceptos de la cursada posibles asi que preferi que las imagenes se guarden en un Storage propio.

## Porque Colors?
Para facilitarme en el entorno de desarrollo la vision de la consola. 

## Estructura de la API Rest
El desarrollo se dividio en principio en 2 carpetas.
* SRC (Codigo fuente)
* BUILD (Codigo compilado)

En la carpeta SRC podemos identificar las siguientes carpetas:
* configurations 
* controllers
* databases
* services
* v1 (se implemento control de versiones para la API de modo de proveer retrocompatibilidad )

### Servicios
*dbService.ts :
En este archivo se implementan las clases que componen los objetos de producto y de carrito. 
y el manejador de Datos que provee storage mediante FS.promises
Este servicio provee persistencia a traves de 2 archivos. 
XXX.JSONE y 
XXX.version

Este Servicio implementa dos novedades respecto de la version anterior.
1) Antes de hacer un read y cargar el JSON en el objeto hace un read del archivo .version. 
En ese archivo hay un timeStamp que se compara con la propiedad version del objeto.
Si coincide no hace el read porque los datos estan actualizados.
Cada vez que se escribe en la base de datos se actualiza el timeStamp en el objeto y en el .version.
2) El Archivo de datos no tiene [], estos se agregan en runtime antes de agregarlos al objeto.
esto permite usar appendFile en lugar de hacer el write de todo el documento.

Ambas modificaciones permiten un codigo mas performante en grandes volumenes de datos.

*validation.ts
Aqui hay 2 clases:
1) authValidation: Simplemente es un middleware que verifica que el usuario tenga  o no privilegios de admin 
2) ValidatorWare: Este es un middleware al que se le pasa un objeto validador. 
Las claves de este objeto deben coincidir con los campos de JSON a validar. 
mediante un Object.keys se hace una iteracion de las claves del JSON recibido y se comparan con las claves del objeto usando RegExp. 
Si hay una RegExp que no pasa la prueba no valida el request y termina la funcion 
Si un campo del JSON no esta en el objeto pasa la validacion 
y Si todos los campos validan pasa al controller. 

### Rutas
En el proyecto se implementan 2 rutas:
* localhost:8080/api/productos
### Documentacion API/PRODUCTS
https://documenter.getpostman.com/view/8617895/2s8YzQWPhx
* localhost:8080/api/cart
### Documentacion API/CART
https://documenter.getpostman.com/view/8617895/2s8YzQWPhu

### Controladores
La api cuenta con 2 controladores 
1 para cada ruta.
* Cart: 
1) createCart genera un nuevo objeto Cart {id:x,timestamp:x,products[]}
2) addProduct Agrega un item al array products
3) getCart Muestra el cart que corresponde al Id del Param
4) deleteCart Borra el cart que corresponde al id del param 
5) deleteProduct Borra el producto del cart que corresponde al id del cart y al id del product 

* products:
1) getItems: Esta funcion obtiene 1 o todos los productos que hay en la base de datos dependiendo de si el request tiene o no params
2) updateItem: Actualiza el producto cuyo id coincide con el del param 
3) deleteItem: Borra el producto con el id coincidente con el param
4) responseAnalizer: Emite el response de todas las otras funciones 

### Configutations.ts
Archivo donde coloco todas las configuraciones necesarias para las dependencias del proyecto y las importo luego en el lugar que se requieren 








