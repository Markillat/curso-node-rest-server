const validaCampos = require('../middlewares/validar-campos');
const validaJWT = require('../middlewares/validar-jwt');
const validaRoles = require('../middlewares/validar-roles');
const validarArchivo = require('../middlewares/validar-arhivo');

module.exports = {
    ...validaCampos,
    ...validaJWT,
    ...validaRoles,
    ...validarArchivo,
}