const {response} = require('express')
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const {generarJWT} = require("../helpers/generarJWT");

const login = async (req, res = response) => {
    const {correo, password} = req.body

    try {
        // Verificar el email existe
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }

        //El usuario activo en la BD
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado:false'
            })
        }


        //verificar la contraseña
        const verificarPassword = bcryptjs.compareSync(password, usuario.password)
        if (!verificarPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        })

    } catch (e) {
        console.log(e)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

module.exports = {login}

