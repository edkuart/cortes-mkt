# 🛒 Marketplace Backend - Conexión a SQLite y actualización total
# 📁 app/instance/app.py

from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Actualizar un producto por ID
@app.route("/productos/<int:producto_id>", methods=["PUT"])
def actualizar_producto(producto_id):
    producto = Producto.query.get(producto_id)
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404

    data = request.get_json()
    producto.nombre = data.get("nombre", producto.nombre)
    producto.precio = data.get("precio", producto.precio)
    db.session.commit()

    return jsonify(producto.to_dict())

# Eliminar un producto por ID
@app.route("/productos/<int:producto_id>", methods=["DELETE"])
def eliminar_producto(producto_id):
    producto = Producto.query.get(producto_id)
    if producto:
        db.session.delete(producto)
        db.session.commit()
        return jsonify({"mensaje": "Producto eliminado exitosamente."}), 200
    return jsonify({"error": "Producto no encontrado"}), 404

# Configuración de la base de datos SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///marketplace.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Modelo de Producto en base de datos
class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    precio = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "precio": self.precio
        }

# Crear la base de datos (solo una vez al inicio)
with app.app_context():
    db.create_all()

# Ruta de bienvenida
@app.route("/")
def home():
    return "\u00a1Bienvenido al Marketplace de Cortes!"

# Obtener todos los productos desde base de datos
@app.route("/productos", methods=["GET"])
def obtener_productos():
    productos = Producto.query.all()
    return jsonify([producto.to_dict() for producto in productos])

# Obtener un producto por ID
@app.route("/productos/<int:producto_id>", methods=["GET"])
def obtener_producto(producto_id):
    producto = Producto.query.get(producto_id)
    if producto:
        return jsonify(producto.to_dict())
    return jsonify({"error": "Producto no encontrado"}), 404

# Crear un nuevo producto y guardarlo en base de datos
@app.route("/productos", methods=["POST"])
def crear_producto():
    data = request.get_json()
    nuevo = Producto(
        nombre=data.get("nombre"),
        precio=data.get("precio")
    )
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.to_dict()), 201

if __name__ == "__main__":
    app.run(debug=True)
