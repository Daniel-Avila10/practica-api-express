// Importamos la librería de Express
const express = require('express');

// Inicializamos la aplicación de Express
const app = express();

// Configuramos la app para que pueda entender los datos en formato JSON
app.use(express.json());

// Definimos el puerto en el que va a correr el servidor
const PORT = 3000;

// Arreglo en memoria para simular nuestra base de datos de productos
let productos = [
    { id: 1, nombre: "Laptop", precio: 1200 },
    { id: 2, nombre: "Mouse Óptico", precio: 25 },
    { id: 3, nombre: "Teclado Mecánico", precio: 75 }
];

// Ruta base (/) para confirmar que el servidor está en línea
app.get('/', (req, res) => {
    res.send('El servidor está en línea y funcionando correctamente.');
});

// Endpoint GET para obtener el arreglo completo de productos
app.get('/api/productos', (req, res) => {
    res.json(productos);
});

// Endpoint GET para buscar un producto específico por su ID
app.get('/api/productos/:id', (req, res) => {
    // Extraemos el id de los parámetros de la URL y lo convertimos a número
    const idBuscar = parseInt(req.params.id);
    
    // Buscamos el objeto dentro de nuestro arreglo en memoria
    const productoEncontrado = productos.find(p => p.id === idBuscar);
    
    // Si no se encuentra el producto, respondemos con un estado 404
    if (!productoEncontrado) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    
    // Si sí existe, lo devolvemos en formato JSON
    res.json(productoEncontrado);
});

// Endpoint POST para crear y agregar un nuevo producto
app.post('/api/productos', (req, res) => {
    const { nombre, precio } = req.body;
    
    // Generamos un ID dinámico sumándole 1 al ID del último producto en el arreglo
    const nuevoId = productos.length > 0 ? productos[productos.length - 1].id + 1 : 1;
    
    // Creamos el nuevo objeto
    const nuevoProducto = {
        id: nuevoId,
        nombre: nombre,
        precio: precio
    };
    
    // Lo empujamos al arreglo en memoria
    productos.push(nuevoProducto);
    
    // Respondemos con el estado 201 Created y devolvemos el objeto creado
    res.status(201).json(nuevoProducto);
});

// Endpoint PUT para actualizar un producto existente por su ID
app.put('/api/productos/:id', (req, res) => {
    const idActualizar = parseInt(req.params.id);
    const { nombre, precio } = req.body;
    
    // Buscamos el producto en nuestro arreglo
    const producto = productos.find(p => p.id === idActualizar);
    
    // Si no existe, devolvemos un 404 Not Found
    if (!producto) {
        return res.status(404).json({ mensaje: "Producto no encontrado para actualizar" });
    }
    
    // Actualizamos las propiedades del objeto encontrado
    if (nombre) producto.nombre = nombre;
    if (precio) producto.precio = precio;
    
    // Devolvemos el objeto modificado
    res.json(producto);
});

// Endpoint DELETE para eliminar un producto por su ID
app.delete('/api/productos/:id', (req, res) => {
    const idEliminar = parseInt(req.params.id);
    
    // Buscamos la posición del producto en el arreglo
    const indice = productos.findIndex(p => p.id === idEliminar);
    
    // Si no existe, devolvemos un 404 Not Found
    if (indice === -1) {
        return res.status(404).json({ mensaje: "Producto no encontrado para eliminar" });
    }
    
    // Eliminamos el producto del arreglo usando su índice
    productos.splice(indice, 1);
    
    // Devolvemos el mensaje de confirmación solicitado por el manual
    res.json({ mensaje: "Producto eliminado correctamente" });
});

// Levantamos el servidor para que escuche en el puerto configurado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
