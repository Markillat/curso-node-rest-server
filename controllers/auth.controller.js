const {response} = require('express')
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const {generarJWT} = require("../helpers/generarJWT");
const {googleVerify} = require("../helpers/google-verify");

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
        const token = await generarJWT(usuario.id);


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

const googleSignIn = async (req, res = response) => {
    const {id_token} = req.body;

    try {
        const {nombre, img, correo} = await googleVerify(id_token);

        let usuario = await Usuario.findOne({correo});

        if (!usuario) {
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario en DB
        if (!usuario.estado) {
            res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (e) {
        console.log(e)
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }
}

module.exports = {login, googleSignIn}

