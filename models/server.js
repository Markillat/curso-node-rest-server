const express = require('express')
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.userPath = '/api/usuarios';
        //Middleware
        this.middleware();

        // Routes de mi aplicacion
        this.routes();
    }

    middleware() {
        //CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use( express.json());

        //Directorio publico
        this.app.use(express.static('public'));
    }

    routes() {
        this.app.use(this.userPath, require('../routes/user.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server en el puerto ${this.port}`);
        })
    }
}

module.exports = Server
