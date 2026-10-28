// Activamos dotenv al inicio para que lea las variables del archivo .env
require('dotenv').config();
const db = require('./database/db');

// Importamos las librerías de Express y CORS
const express = require('express');
const cors = require('cors');

// Inicializamos la aplicación de Express
const app = express();

// Configuramos la app para que pueda entender los datos en formato JSON
app.use(express.json());

// Habilitamos CORS globalmente para permitir que el frontend se conecte
app.use(cors());

// Definimos el puerto en el que va a correr el servidor jalándolo del archivo .env
const PORT = process.env.PORT || 3000;

// Ruta base (/) para confirmar que el servidor está en línea
app.get('/', (req, res) => {
    res.send('El servidor está en línea y funcionando correctamente.');
});

// 1. Endpoint GET para obtener todos los productos de la base de datos
app.get('/api/productos', async (req, res) => {
    try {
        const [filas] = await db.query('SELECT * FROM productos');
        res.json(filas);
    } catch (error) {
        console.error("Error en GET /api/productos:", error.message);
        res.status(500).json({ mensaje: "Error interno del servidor al consultar los productos" });
    }
});

// 2. Endpoint GET para buscar un producto específico por su ID en la base de datos
app.get('/api/productos/:id', async (req, res) => {
    try {
        const idBuscar = parseInt(req.params.id);
        const [filas] = await db.query('SELECT * FROM productos WHERE id = ?', [idBuscar]);
        
        if (filas.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }
        
        res.json(filas);
    } catch (error) {
        console.error("Error en GET /api/productos/:id:", error.message);
        res.status(500).json({ mensaje: "Error interno del servidor al buscar el producto" });
    }
});

// 3. Endpoint POST para crear y agregar un nuevo producto en la base de datos
app.post('/api/productos', async (req, res) => {
    try {
        const { nombre, precio } = req.body;
        const [resultado] = await db.query('INSERT INTO productos (nombre, precio) VALUES (?, ?)', [nombre, precio]);
        
        const nuevoProducto = {
            id: resultado.insertId,
            nombre: nombre,
            precio: precio
        };
        
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error("Error en POST /api/productos:", error.message);
        res.status(500).json({ mensaje: "Error interno del servidor al guardar el producto" });
    }
});

// 4. Endpoint PUT para actualizar un producto existente por su ID en la base de datos
app.put('/api/productos/:id', async (req, res) => {
    try {
        const idActualizar = parseInt(req.params.id);
        const { nombre, precio } = req.body;
        
        const [resultado] = await db.query('UPDATE productos SET nombre = ?, precio = ? WHERE id = ?', [nombre, precio, idActualizar]);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado para actualizar" });
        }
        
        res.json({ id: idActualizar, nombre, precio });
    } catch (error) {
        console.error("Error en PUT /api/productos/:id:", error.message);
        res.status(500).json({ mensaje: "Error interno del servidor al actualizar el producto" });
    }
});

// 5. Endpoint DELETE para eliminar un producto por su ID de la base de datos
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const idEliminar = parseInt(req.params.id);
        const [resultado] = await db.query('DELETE FROM productos WHERE id = ?', [idEliminar]);
        
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado para eliminar" });
        }
        
        res.json({ mensaje: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error en DELETE /api/productos/:id:", error.message);
        res.status(500).json({ mensaje: "Error interno del servidor al eliminar el producto" });
    }
});

// Levantamos el servidor e intentamos verificar la conexión a la base de datos
app.listen(PORT, async () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);

    try {
        await db.query('SELECT 1');
        console.log("Conectado exitosamente a la base de datos");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
    }
});
