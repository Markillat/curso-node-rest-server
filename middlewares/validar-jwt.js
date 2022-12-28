const { response } = require('express')
const jwt  = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const validarJwt = async (req, res = response, next) => {
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETPRIVATEKEY)
        const usuario = await Usuario.findById(uid)
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no valido - usuario no existe'
            })
        }

        //verificar el uid si tiene estado true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario estado: false'
            })
        }
        req.usuario_auth = usuario;
        next();

    } catch (e) {
        console.log(e)
        res.status(401).json({
            msg: 'Token no valido'
        })
    }
}

module.exports = { validarJwt }