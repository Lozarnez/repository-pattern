const AddressRepository = require('@repository/address.repository');

const getAddress = async ({ page, limit }) => {
  const query = { status: 1 }; // El servicio se encarga de decidir las reglas para filtrar
  const projection = { id: 1, zip: 1, street: 1 }; // El servicio se encarga de decidir qué campos se deben devolver
  return await AddressRepository.find(query, projection, { page, limit });
};

module.exports = {
  getAddress,
};
