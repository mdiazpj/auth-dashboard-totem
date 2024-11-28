const express = require('express');
const { saveLog } = require('../controllers/logController'); // Importación en CommonJS

const router = express.Router();

router.post('/log', saveLog);

module.exports = router; // Exportación en CommonJS
