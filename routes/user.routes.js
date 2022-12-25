const {Router} = require('express');
const {userGet, userPost, userPut, userDelete, userPatch} = require("../controllers/user.controller");
const {check} = require("express-validator");
const router = Router();
const {validarCampos} = require('../middlewares/validar-campos')
const {esRoleValido, emailExiste, existeUsuarioById} = require("../helpers/db-validators");

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
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioById),
    validarCampos
],userDelete);

router.patch('/', userPatch)

module.exports = router;