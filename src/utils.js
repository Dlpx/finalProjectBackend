import multer from "multer";
import { dirname, extname, join } from 'path';
import { fileURLToPath } from "url";


const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const MIMETYPES = ['image/jpeg', 'image/png'];



export const multerUploader = multer({
    storage: multer.diskStorage({
        //Donde se guardara la foto: (posicion inicial, camino hasta la carpeta destino)
        destination: join(CURRENT_DIR, '/public/imgs'),
        //Aca manejamos el nombre del archivo
        filename: (req, file, cb) => {
            //Obtenemos la extension
            const extension = extname(file.originalname);
            //Separamos el nombre original, de la extension
            const filename = file.originalname.split(extension)[0];
            //Le damos al CB el nombre nuevo incluyendo el Date.now para hacer un nombre unico
            cb(null, `${filename}-${Date.now()}${extension}`);
        }
    }),

    //Chequeamos si la extension esta permitida
    fileFilter: (req, file, cb) => {
        //Si MIMETYPES incluye la extension entonces error: null y archivo permitido: true
        if (MIMETYPES.includes(file.mimetype)) cb(null, true)
        //Sino, tirar un nuevo error por el CB
        else cb(new Error(`Archivo no permitido, solo subir archivos con extensiones como ${MIMETYPES.join(' ')}`))
    },
    //Aplicamos filtro de tamaño de archivo en Bytes
    limits: {
        fieldSize: 10000000
    }
});