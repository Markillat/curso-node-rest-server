const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const userGet = async (req = request, res = response) => {
    const {limit = 5, desde = 0} = req.query;
    const query = {estado: true};
    //Retarda la respuesta
    // const usuarios = await Usuario.find({estado: true})
    //     .skip(desde)
    //     .limit(limit)
    //
    // const total = await Usuario.countDocuments({estado: true});

    //Agilisa el tiempo de respuesta asyncomo y simultaneo
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(desde)
            .limit(limit)
    ]);

    res.status(200).json({
        ok: true,
        total,
        data: usuarios
    });
};

const userPost = async (req, res = response) => {

    const {nombre, correo, password, rol} = req.body
    const usuario = new Usuario({nombre, correo, password, rol});

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en BD
    await usuario.save();

    res.json({
        ok: true,
        msg: "post API - Controller",
        data: {
            usuario
        }
    })
};

const userPut = async(req, res = response) => {
    const {id} = req.params;
    const {_id, password, google, correo, ...resto} = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        ok: true,
        msg: "put API - controller " + id,
        usuario
    });
};

const userDelete = async (req, res = response) => {
    const {id} = req.params
    //Elimando fisicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false});
    const usuarioAutenticado = req.usuario_auth

    res.json({
        ok: true,
        msg: "delete API - Controller",
        usuarioEliminado,
        usuarioAutenticado
    })
};

const userPatch = (req, res = response) => {
    res.json({
        ok: true,
        msg: "patch API"
    })
};

module.exports = {userGet, userPost, userPut, userDelete, userPatch};