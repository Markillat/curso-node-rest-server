const {Router} = require('express')
const {check} = require("express-validator");
const {validarJwt} = require("../middlewares/validar-jwt");
const {validarCampos} = require("../middlewares/validar-campos");
const {existeCategoria, existeProducto} = require("../helpers/db-validators");
const {crearProducto, obtenerProductos, obtenerProductoById, actualizarProducto, eliminarProducto} = require("../controllers/producto.controller");
const {esAdminRole} = require("../middlewares/validar-roles");

const router = new Router();

router.get('/', obtenerProductos)

router.get('/:id', [
    check('id', 'El id no es valido en MongoId').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], obtenerProductoById)

router.post('/', [
    validarJwt,
    check('nombre', 'El campo nombre es requido').not().isEmpty(),
    check('precio', 'El campo precio es requido').not().isEmpty(),
    check('categoria', 'El id no es valido en MongoId').isMongoId(),
    check('categoria').custom(existeCategoria),
    check('descripcion', 'El campo descripcion es requerido').not().isEmpty(),
    validarCampos
], crearProducto)

router.put('/:id', [
    validarJwt,
    check('id', 'El id no es valido en MongoId').isMongoId(),
    check('id').custom(existeProducto),
    check('nombre', 'El campo nombre es requido').not().isEmpty(),
    check('precio', 'El campo precio es requido').not().isEmpty(),
    check('categoria', 'El id no es valido en MongoId').isMongoId(),
    check('categoria').custom(existeCategoria),
    check('descripcion', 'El campo descripcion es requerido').not().isEmpty(),
    validarCampos
], actualizarProducto)

router.delete('/:id', [
    validarJwt,
    esAdminRole,
    check('id', 'El id no es valido en MongoId').isMongoId(),
    check('id').custom(existeProducto),
    validarCampos
], eliminarProducto)

module.exports = router