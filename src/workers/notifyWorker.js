// src/workers/notifyWorker.js
const { parentPort } = require("worker_threads");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

// Configuración básica del transportador de correo (puedes ajustarlo con variables .env)
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.MAIL_PORT || 587),
  secure: false, // true para puerto 465, false para 587
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/**
 * Envía una notificación asíncrona (correo o log).
 * @param {Object} data
 * @param {String} data.to - Correo destinatario
 * @param {String} data.subject - Asunto
 * @param {String} data.text - Cuerpo del mensaje
 */
const enviarNotificacion = async (data) => {
  const { to, subject, text } = data;

  if (!to || !subject) {
    throw new Error("Datos de notificación incompletos");
  }

  // Simulación o envío real según configuración
  if (process.env.MAIL_MOCK === "true") {
    const logDir = path.join(__dirname, "../../tmp/notifications");
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

    const filePath = path.join(logDir, `notify_${Date.now()}.txt`);
    fs.writeFileSync(
      filePath,
      `TO: ${to}\nSUBJECT: ${subject}\n\n${text}`,
      "utf8"
    );
    return { mock: true, savedTo: filePath };
  }

  // Envío real con Nodemailer
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject,
    text,
  });

  return { success: true, messageId: info.messageId };
};

// Escuchar mensajes desde el hilo principal
parentPort.on("message", async (payload) => {
  try {
    if (!payload) {
      throw new Error("Payload de notificación requerido");
    }
    const result = await enviarNotificacion(payload);
    parentPort.postMessage({ success: true, result });
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message || "Error desconocido en worker" });
  }
});

// Manejar errores no capturados en el worker
process.on("uncaughtException", (err) => {
  parentPort.postMessage({ success: false, error: `Excepción no controlada: ${err.message}` });
});

process.on("unhandledRejection", (reason) => {
  const errorMessage = reason instanceof Error ? reason.message : String(reason);
  parentPort.postMessage({ success: false, error: `Promesa rechazada: ${errorMessage}` });
});
