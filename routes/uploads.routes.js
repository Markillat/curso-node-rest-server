const {check} = require("express-validator");
const {Router} = require("express");
const {validarCampos} = require("../middlewares/validar-campos");
const {cargarArchivos, actualizarImagen, mostrarImage, actualizarImagenCloudinary} = require("../controllers/uploads.controller");
const {coleccionesPermitidas} = require("../helpers");
const {validarArhivo} = require("../middlewares");

const router = Router();

router.post('/', validarArhivo, cargarArchivos);

router.put('/:coleccion/:id', [
    validarArhivo,
    check('id', 'EL id debe ser un id de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary)

router.get('/:coleccion/:id', [
    check('id', 'EL id debe ser un id de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImage)


module.exports = router;