const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const initializeRoles = require('./utils/initializeRoles');
const cors = require('cors'); // Importar el paquete cors
const logRoutes = require('./routes/logRoutes.js');

const app = express();

// Configurar CORS
app.use(cors());

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/api/logs', logRoutes);

sequelize.sync()
  .then(async () => {
    await initializeRoles(); // Initialize roles after syncing the database
    app.listen(3000, () => {
      console.log('Server running on http://localhost:3000');
    });
  })
  .catch(err => console.log('Database connection failed:', err));
