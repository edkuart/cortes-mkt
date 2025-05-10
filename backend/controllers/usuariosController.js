// backend/controllers/usuariosController.js

const obtenerUsuarios = (req, res) => {
    res.json([
      { id: 1, nombre: "Usuario de prueba" },
      { id: 2, nombre: "Otro usuario" }
    ]);
  };
  
  const registrarUsuario = (req, res) => {
    const { nombre, correo, contraseña } = req.body;
    // Aquí deberías guardar el usuario en la base de datos (simulado)
    res.status(201).json({ mensaje: "Usuario registrado", usuario: { nombre, correo } });
  };
  
  const loginUsuario = (req, res) => {
    const { correo, contraseña } = req.body;
    // Aquí deberías validar el usuario contra la base de datos (simulado)
    if (correo === "test@correo.com" && contraseña === "1234") {
      res.json({ mensaje: "Login exitoso", token: "fake-jwt-token" });
    } else {
      res.status(401).json({ mensaje: "Credenciales inválidas" });
    }
  };
  
  module.exports = {
    obtenerUsuarios,
    registrarUsuario,
    loginUsuario
  };
  
  
  