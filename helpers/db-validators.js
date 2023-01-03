const Role = require("../models/role.model");
const Usuario = require("../models/usuario");
const {Categoria, Producto} = require("../models");

const esRoleValido = async (rol = '') => {
    const existRole = await Role.findOne({rol})
    if (!existRole) {
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }
}

const emailExiste = async(correo = '') => {
    const existEmail = await Usuario.findOne({ correo })
    if (existEmail) {
        throw new Error("El correo ya se encuentra registrado");
    }
}

const existeUsuarioById = async(id) => {
    const existeUsuario = await Usuario.findById(id)
    if (!existeUsuario) {
        throw new Error(`El id: ${id} no existe`);
    }
}

const existeCategoria = async (id) => {
    const categoria = await Categoria.findById(id)
    if (!categoria) {
        throw new Error(`El id: ${id} no existe`);
    }
}

const existeProducto = async (id) => {
    const producto = await Producto.findById(id)
    if (!producto) {
        throw new Error(`El id: ${id} no existe`);
    }
}

//Validar colleciones permitidas

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion)
    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es pertidad, ${colecciones}`)
    }
    return true;
}

module.exports = {esRoleValido, emailExiste, existeUsuarioById, existeCategoria, existeProducto, coleccionesPermitidas}