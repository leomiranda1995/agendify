const AgendifyError = require('../exceptions/AgendifyException');
const ServicesRepository = require('../repositories/ServiceRepository');
const UserModule = require('./UserModule');

class ServiceModule {
  async listServices(orderBy, userId) {
    const services = await ServicesRepository.findAll(orderBy, userId);

    return services;
  }

  async listService(id) {
    const service = await ServicesRepository.findById(id);

    if (!service) {
      throw new AgendifyError('Service not found', 400);
    }

    return service;
  }

  async createService({
    name, description, price, availability,
    special_requirements, optional, photos, user_id,
  }) {
    const user = await UserModule.listUser(user_id);

    if (!user.professional) {
      throw new AgendifyError('User is not professional', 400);
    }

    if (!name) {
      throw new AgendifyError('Name is required', 400);
    }

    const service = await ServicesRepository.create({
      name,
      description,
      price,
      availability,
      special_requirements,
      optional,
      photos,
      user_id,
    });

    return service;
  }

  async updateService(id, {
    name, description, price, availability,
    special_requirements, optional, photos,
  }) {
    const serviceExists = await ServicesRepository.findById(id);
    if (!serviceExists) {
      throw new AgendifyError('Service not found', 404);
    }

    const service = await ServicesRepository.update(id, {
      name,
      description,
      price,
      availability,
      special_requirements,
      optional,
      photos,
    });

    return service;
  }

  async deleteService(id) {
    await ServicesRepository.delete(id);
  }
}

module.exports = new ServiceModule();
