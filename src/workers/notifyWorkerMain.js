// src/workers/notifyWorkerMain.js
const path = require("path");
const { Worker } = require("worker_threads");

/**
 * Ejecuta un worker para enviar una notificación asíncrona.
 * @param {Object} payload - { to, subject, text }
 */
function runNotifyWorker(payload) {
  return new Promise((resolve, reject) => {
    const workerPath = path.join(__dirname, "notifyWorker.js");
    const worker = new Worker(workerPath);

    worker.postMessage(payload);

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

module.exports = { runNotifyWorker };
