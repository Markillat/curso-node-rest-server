const {Router} = require('express');
const {userGet, userPost, userPut, userDelete, userPatch} = require("../controllers/user.controller");
const {check} = require("express-validator");

const {validarCampos} = require('../middlewares/validar-campos')
const {validarJwt} = require("../middlewares/validar-jwt");
const {esAdminRole, tieneRole} = require("../middlewares/validar-roles");

const {esRoleValido, emailExiste, existeUsuarioById} = require("../helpers/db-validators");

const router = Router();

router.get('/', userGet);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioById),
    check('rol').custom(esRoleValido),
    validarCampos], userPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser más de 6 letras').isLength({min: 6}),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExiste),
    check('rol').custom(esRoleValido),
    validarCampos], userPost);

router.delete('/:id', [
    validarJwt,
    //esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
], userDelete);

router.patch('/', userPatch)

module.exports = router;