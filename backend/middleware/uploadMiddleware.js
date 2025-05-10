const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Detectar carpeta por tipo de carga
    if (file.fieldname.includes('producto')) {
      cb(null, 'uploads/productos/');
    } else {
      cb(null, 'uploads/dpi/');
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + Date.now() + ext;
    cb(null, name);
  }
});

const upload = multer({ storage });

module.exports = upload;
