const {response} = require("express");

const esAdminRole = (req, res = response, next) => {

    if (!req.usuario_auth) {
        return res.status(500).json({
            msg: 'Se quiere verificar el role sin validar el token primero'
        })
    }
    const {rol, nombre} = req.usuario_auth

    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es adminsitrador`
        })
    }
    next();
}

const tieneRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.usuario_auth) {
            return res.status(500).json({
                msg: 'Se quiere verificar el role sin validar el token primero'
            })
        }

        if (!roles.includes(req.usuario_auth.rol)) {
            return res.status(401).json({
                msg: `El servicio require uno de estos roles ${roles}`
            })
        }
        next();
    }
}

module.exports = {esAdminRole, tieneRole}