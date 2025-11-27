// src/workers/reportWorkerMain.js
const path = require("path");
const { Worker } = require("worker_threads");

/**
 * Ejecuta un worker de reporte con un payload específico.
 * Devuelve una promesa que se resuelve cuando el worker termina.
 *
 * @param {Object} payload - { type: string, filtros: object }
 */
function runReportWorker(payload) {
  return new Promise((resolve, reject) => {
    const workerPath = path.join(__dirname, "reportWorker.js");
    const worker = new Worker(workerPath);

    // Enviar mensaje inicial al worker
    worker.postMessage(payload);

    // Escuchar respuesta
    worker.on("message", (msg) => {
      if (msg.success) {
        resolve(msg.result);
      } else {
        reject(new Error(msg.error));
      }
      worker.terminate();
    });

    worker.on("error", (err) => {
      reject(err);
      worker.terminate();
    });

    worker.on("exit", (code) => {
      // Worker finalizado
    });
  });
}

module.exports = { runReportWorker };
