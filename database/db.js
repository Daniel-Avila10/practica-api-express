// Importamos el conector de MySQL que instalamos con npm
const mysql = require('mysql2');

// Traemos las herramientas de dotenv para leer las variables de entorno
require('dotenv').config();

// Creamos un pool de conexiones utilizando las variables ocultas del archivo .env
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: 3306 // Puerto por defecto que usa MySQL en XAMPP
});

// Exportamos la conexión en modo promesa para poder usar async/await más adelante
module.exports = pool.promise();
