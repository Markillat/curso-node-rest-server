const {response} = require("express");

const validarArhivo = (req, res = response, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({msg: 'No hay archivos en la peticion que subir - validarArchivo'});
    }
    next();
}

module.exports = {validarArhivo}