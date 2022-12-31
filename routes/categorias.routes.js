const {Router} = require('express')
const {validarCampos} = require("../middlewares/validar-campos");
const {validarJwt} = require("../middlewares/validar-jwt");
const {check} = require("express-validator");
const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaById,
    actualizarCatagoria, borrarCategoria
} = require("../controllers/categoria.controller");
const {existeCategoria} = require("../helpers/db-validators");
const {esAdminRole} = require("../middlewares/validar-roles");

const router = new Router();


// Obtener toddas las categorias - publico
router.get('/', obtenerCategorias)

// Obterner una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], obtenerCategoriaById)

// Crear categria - privado personacon un token valido
router.post('/', [
    validarJwt,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

// Actualizar -privado - cualqioer con un token valido
router.put('/:id', [
    validarJwt,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCatagoria)

// Borrar una categoria -Admin
router.delete('/:id',[
    validarJwt,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos
], borrarCategoria)

module.exports = router