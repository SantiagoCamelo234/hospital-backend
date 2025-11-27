// src/workers/reportWorker.js
const { parentPort } = require("worker_threads");
const fs = require("fs");
const path = require("path");

/**
 * Función simulada de generación de reportes
 * En un caso real, aquí podrías hacer:
 *  - Consultas a la base de datos (según filtros)
 *  - Procesamiento de datos
 *  - Generación de CSV, JSON o PDF
 */
const generarReporte = async (payload) => {
  try {
    if (!payload || !payload.type) {
      throw new Error("Payload inválido: se requiere 'type'");
    }

    const { type, filtros } = payload;
    const fecha = new Date().toISOString().split("T")[0];
    const fileName = `${type}_reporte_${fecha}.json`;
    const tmpDir = path.join(__dirname, "../../tmp");
    
    // Asegurar que el directorio existe
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const filePath = path.join(tmpDir, fileName);

    // Simular proceso intensivo (ejemplo: 2 segundos)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const fakeData = {
      generado: new Date().toISOString(),
      tipo: type,
      filtros,
      resultados: [
        { id: 1, descripcion: "Ejemplo de registro A" },
        { id: 2, descripcion: "Ejemplo de registro B" },
      ],
    };

    fs.writeFileSync(filePath, JSON.stringify(fakeData, null, 2), "utf-8");

    return {
      success: true,
      file: filePath,
      registros: fakeData.resultados.length,
    };
  } catch (error) {
    throw new Error(`Error al generar reporte: ${error.message}`);
  }
};

/**
 * Escucha los mensajes enviados desde el hilo principal
 */
parentPort.on("message", async (message) => {
  try {
    const result = await generarReporte(message);
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
