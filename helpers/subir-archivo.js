const {v4: uuidv4} = require("uuid");
const path = require("path");

const subirArchivo = ( files, extensionValidas = ['jpg', 'png', 'jpeg', 'gif'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        const {archivo} = files;
        const nombreCortado = archivo.name.split('.')
        const extension = nombreCortado[nombreCortado.length - 1];

        if (!extensionValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida, ${extensionValidas}`);
        }

        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(nombreTemp);
        });
    })
}

module.exports = {subirArchivo}