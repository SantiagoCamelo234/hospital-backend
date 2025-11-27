// src/services/usuarios/authService.js
const { generateToken } = require("../../utils/tokenUtils");

class AuthService {
  constructor(usuarioRepo, pacienteRepo = null, medicoRepo = null) {
    this.usuarioRepo = usuarioRepo;
    this.pacienteRepo = pacienteRepo;
    this.medicoRepo = medicoRepo;
  }

  async registrar(data) {
    try {
      if (!data) throw new Error("Datos de registro requeridos");
      if (!data.email) throw new Error("Email requerido");
      if (!data.password) throw new Error("Contraseña requerida");
      if (!data.nombre_usuario) throw new Error("Nombre de usuario requerido");
      if (!data.rol) throw new Error("Rol requerido");

      const rol = data.rol.toLowerCase();
      const rolesValidos = ["admin", "medico", "paciente"];
      if (!rolesValidos.includes(rol)) {
        throw new Error(`Rol inválido. Debe ser uno de: ${rolesValidos.join(", ")}`);
      }


      // Validar datos según el rol
      if (rol === "paciente") {
        if (!data.nombre) throw new Error("Nombre requerido para paciente");
        if (!data.apellido) throw new Error("Apellido requerido para paciente");
      } else if (rol === "medico") {
        if (!data.nombre) throw new Error("Nombre requerido para médico");
        if (!data.apellido) throw new Error("Apellido requerido para médico");
        if (!data.especialidad) throw new Error("Especialidad requerida para médico");
        if (!data.licencia_medica) throw new Error("Licencia médica requerida para médico");
      }

      // Crear usuario en la tabla usuarios
      const userData = {
        nombre_usuario: data.nombre_usuario,
        email: data.email,
        password: data.password,
        rol: rol,
      };
      const user = await this.usuarioRepo.create(userData);

      const userId = user.id || user._id;

      // Crear registro en la tabla correspondiente según el rol
      if (rol === "paciente" && this.pacienteRepo) {
        try {
          const pacienteData = {
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            telefono: data.telefono || null,
            fecha_nacimiento: data.fecha_nacimiento || null,
            direccion: data.direccion || null,
          };
          const paciente = await this.pacienteRepo.create(pacienteData);
        } catch (error) {
          // Si falla crear el paciente, intentar eliminar el usuario creado
          try {
            await this.usuarioRepo.delete(userId);
          } catch (deleteError) {
            // Error al eliminar usuario después de fallo
          }
          throw new Error(`Error al crear registro de paciente: ${error.message}`);
        }
      } else if (rol === "medico" && this.medicoRepo) {
        try {
          const medicoData = {
            nombre: data.nombre,
            apellido: data.apellido,
            especialidad: data.especialidad,
            telefono: data.telefono || null,
            email: data.email,
            licencia_medica: data.licencia_medica,
          };
          const medico = await this.medicoRepo.create(medicoData);
        } catch (error) {
          // Si falla crear el médico, intentar eliminar el usuario creado
          try {
            await this.usuarioRepo.delete(userId);
          } catch (deleteError) {
            // Error al eliminar usuario después de fallo
          }
          throw new Error(`Error al crear registro de médico: ${error.message}`);
        }
      }

      const token = generateToken({ id: userId, role: user.rol, email: user.email });
      return { user, token };
    } catch (error) {
      // Mejorar mensajes de error específicos
      if (error.code === 11000) {
        throw new Error("El email ya está registrado");
      }
      
      throw error;
    }
  }

  async login(email, password) {
    try {
      if (!email || !password) throw new Error("Email y contraseña requeridos");

      const user = await this.usuarioRepo.verifyCredentials(email, password);
      if (!user) throw new Error("Credenciales inválidas");
      
      const token = generateToken({ id: user.id || user._id, role: user.rol, email: user.email });
      return { user, token };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
