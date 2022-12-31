const {response} = require("express");
const {Categoria} = require("../models");

// obtenerCategorias - paginate - total - populate(indica el ususaior detallado)
const obtenerCategorias = async (req, res = response) => {

    const {desde = 0, limit = 5} = req.query
    const query = {estado: true}

    const [categorias, total] = await Promise.all([
        Categoria.find(query).populate('usuario', 'nombre')
            .skip(desde)
            .limit(limit),
        Categoria.countDocuments(query)
    ])

    res.status(200).json({
        data: categorias,
        total
    })
}

// Obtener categoria -populate {}
const obtenerCategoriaById = async (req, res = response) => {
    const {id} = req.params
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    if(!categoria.estado) {
        return res.status(400).json({
            msg: `La categoria, no existe estado: false`
        });
    }

    res.status(200).json({
        categoria
    })
}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase()

    const categoriaDB = await Categoria.findOne({nombre})

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //Generar la data guardar
    const data = {
        nombre,
        usuario: req.usuario_auth._id
    }

    const categoria = new Categoria(data);

    await categoria.save();

    res.status(201).json(categoria)
}

// actualizarCategoria que sea unico
const actualizarCatagoria = async (req, res = response) => {
    const {id} = req.params

    const { estado, usuario, ...data} = req.body;
    const formatNombre = data.nombre.toUpperCase()
    data.nombre = formatNombre
    data.usuario = req.usuario_auth._id

    const existeNombre = await Categoria.findOne({nombre: formatNombre})

    if (existeNombre) {
        return res.status(400).json({
            msg: `El nombre ${formatNombre} ya existe`
        })
    }

    // new true obtiene la respuesta actualizada
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true}).populate('usuario', 'nombre')

    res.json({
        ok: true,
        categoria
    });
}

//Borrar categoria estado: false
const borrarCategoria = async (req, res = response) => {
    const {id} = req.params
    const categoria = await Categoria.findByIdAndUpdate(id, {estado : false}, {new: true})
    const usuarioAutenticado = req.usuario_auth

    res.json({
        ok: true,
        msg: "delete API - Controller",
        categoria,
        usuarioAutenticado
    })
}

module.exports = {crearCategoria, obtenerCategorias, obtenerCategoriaById, actualizarCatagoria, borrarCategoria}