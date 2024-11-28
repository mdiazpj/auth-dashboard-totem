const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  roleName: {
    type: DataTypes.ENUM('ADMIN', 'TI', 'COMERCIAL', 'TIENDA'),
    allowNull: false
  }
});

module.exports = Role;
