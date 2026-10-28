// URL de nuestra API local que configuramos en la práctica anterior
const URL_API = 'http://localhost:3000/api/productos';

// Función principal que arranca al cargar la página web
async function inicializarDashboard() {
    try {
        // Parte III: Consumo de datos mediante fetch()
        const respuesta = await fetch(URL_API);
        const productos = await respuesta.json();

        // Referenciamos el cuerpo de la tabla en el HTML
        const tbody = document.getElementById('lista-productos');
        tbody.innerHTML = ''; // Limpiamos por seguridad

        // Arreglos para almacenar los datos que usará la gráfica (Parte IV)
        const nombres = [];
        const precios = [];

        // Iteramos sobre los datos recibidos de la base de datos
        productos.forEach(producto => {
            // 1. Inyectamos la fila dinámicamente en el DOM de la tabla
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.id}</td>
                <td>${producto.nombre}</td>
                <td>$${producto.precio}</td>
            `;
            tbody.appendChild(fila);

            // 2. Extraemos la información en arreglos separados para Chart.js
            nombres.push(producto.nombre);
            precios.push(producto.precio);
        });

        // Parte IV: Instanciar y configurar el gráfico de barras dentro del canvas
        const ctx = document.getElementById('miGrafica').getContext('2d');
        new Chart(ctx, {
            type: 'bar', // Tipo de gráfico solicitado (barras)
            data: {
                labels: nombres, // Nombres de los productos en el eje X
                datasets: [{
                    label: 'Precio de Productos ($)',
                    data: precios, // Valores de los costos en el eje Y
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true // Forzamos a que el eje Y inicie en 0
                    }
                }
            }
        });

    } catch (error) {
        console.error("Error al conectar con la API o procesar los datos:", error);
    }
}

// Ejecutamos la función de inicialización cuando el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarDashboard);
