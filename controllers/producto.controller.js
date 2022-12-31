const {response} = require("express");
const {Producto} = require("../models");

const obtenerProductos = async (req, res = response) => {
    const {desde = 0, limite = 5} = req.query
    const query = {estado: true}

    const [productos, total] = await Promise.all([
        Producto.find(query)
            .populate('categoria', 'nombre')
            .populate('usuario', 'nombre')
            .skip(desde)
            .limit(limite),

        Producto.countDocuments(query)
    ])

    res.status(200).json({
        total,
        data: productos
    })
}

const obtenerProductoById = async (req, res = response) => {
    const {id} = req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

    if (!producto.estado) {
        return res.status(400).json({
            msg: `El producto, no existe estado: false`
        });
    }

    res.status(200).json(producto);
}

const crearProducto = async (req, res = response) => {
    const {usuario, estado, disponible, ...payload} = req.body

    const nombre = req.body.nombre.toUpperCase()

    const productoDB = await Producto.findOne({nombre})

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    const data = {
        nombre: nombre,
        usuario: req.usuario_auth._id,
        ...payload
    }

    const producto = new Producto(data);
    await producto.save();

    res.status(201).json({
        msg: `Se creo correctamente`,
        data: producto
    })
}

const actualizarProducto = async (req, res = response) => {
    const {usuario, estado, disponible, ...payload} = req.body
    const {id} = req.params
    const formatNombre = payload.nombre.toUpperCase()

    payload.nombre = formatNombre
    payload.usuario = req.usuario_auth._id;

    const existeNombre = await Producto.findOne({nombre: formatNombre})

    if (existeNombre) {
        return res.status(400).json({
            msg: `El nombre ${formatNombre} ya existe`
        })
    }

    const producto = await Producto.findByIdAndUpdate(id, payload, {new: true}).populate('usuario', 'nombre').populate('categoria', 'nombre');

    res.status(200).json({
        msg: `Se actulizo`,
        data: producto
    })
}

const eliminarProducto = async (req, res = response) => {
    const {id} = req.params
    const producto = await Producto.findByIdAndUpdate(id, {estado : false}, {new: true})
    const usuarioAutenticado = req.usuario_auth

    res.json({
        ok: true,
        msg: "delete API - Controller",
        producto,
        usuarioAutenticado
    })
}

module.exports = {obtenerProductos, obtenerProductoById, crearProducto, actualizarProducto, eliminarProducto}