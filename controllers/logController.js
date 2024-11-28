const fs = require('fs');
const path = require('path');

// Rutas de los archivos de log
const logFilePathReadable = path.resolve('logs', 'requests.log'); // Log legible
const logFilePathCsv = path.resolve('logs', 'requests.csv'); // Log CSV

// Asegúrate de que existan los directorios de logs
if (!fs.existsSync(path.dirname(logFilePathReadable))) {
  fs.mkdirSync(path.dirname(logFilePathReadable), { recursive: true });
}

// Crear archivo CSV inicial si no existe
if (!fs.existsSync(logFilePathCsv)) {
  fs.writeFileSync(logFilePathCsv, 'Timestamp;Method;Endpoint;RequestData\n'); // Encabezados CSV
}

// Función para formatear dinámicamente el contenido de RequestData
function formatRequestData(data, indent = '  ') {
  let formatted = '';
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      if (typeof value === 'object' && value !== null) {
        formatted += `${indent}${key}:\n${formatRequestData(value, indent + '  ')}`;
      } else {
        formatted += `${indent}${key}: ${value}\n`;
      }
    }
  }
  return formatted;
}

// Controlador para guardar logs
function saveLog(req, res) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.body.method || 'UNKNOWN',
    endpoint: req.body.endpoint || 'UNKNOWN',
    requestData: req.body.requestData || {}, // Información genérica
  };

  try {
    // Crear un formato ordenado y legible para el log
    const formattedLogReadable = `========== LOG ==========\n` +
                                 `Timestamp   : ${logEntry.timestamp}\n` +
                                 `Method      : ${logEntry.method}\n` +
                                 `Endpoint    : ${logEntry.endpoint}\n` +
                                 `RequestData :\n${formatRequestData(logEntry.requestData)}\n` +
                                 `=========================\n\n`;

    // Escribir log legible
    fs.appendFileSync(logFilePathReadable, formattedLogReadable);

    // Crear una línea para el CSV (serializamos RequestData como JSON)
    const csvLine = `${logEntry.timestamp};${logEntry.method};${logEntry.endpoint};"${JSON.stringify(logEntry.requestData).replace(/"/g, '""')}"\n`;
    fs.appendFileSync(logFilePathCsv, csvLine);

    res.status(200).json({ message: 'Log guardado correctamente' });
  } catch (error) {
    console.error('Error al guardar el log:', error);
    res.status(500).json({ message: 'Error al guardar el log' });
  }
}

// Exportar el controlador
module.exports = { saveLog };
