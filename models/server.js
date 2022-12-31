const express = require('express')
const cors = require('cors');
const {dbConnection} = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            user: '/api/usuarios',
            category: '/api/categorias',
            productos: '/api/productos',
            buscar: '/api/buscar'
        }

        // Conectar a base de datos
        this.conectarDB();

        //Middleware
        this.middleware();

        // Routes de mi aplicacion
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }

    middleware() {
        //CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.paths.user, require('../routes/user.routes'));
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(this.paths.category, require('../routes/categorias.routes'));
        this.app.use(this.paths.productos, require('../routes/productos.routes'));
        this.app.use(this.paths.buscar, require('../routes/buscar.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server en el puerto ${this.port}`);
        })
    }
}

module.exports = Server