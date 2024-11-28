const Role = require('../models/Role');

const initializeRoles = async () => {
  const roles = ['ADMIN', 'TI', 'COMERCIAL', 'TIENDA'];

  for (const roleName of roles) {
    const roleExists = await Role.findOne({ where: { roleName } });
    if (!roleExists) {
      await Role.create({ roleName });
      console.log(`Role ${roleName} created.`);
    }
  }
};

module.exports = initializeRoles;
