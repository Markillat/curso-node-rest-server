const Role = require("../models/role.model");
const Usuario = require("../models/usuario");

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

module.exports = {esRoleValido, emailExiste, existeUsuarioById}