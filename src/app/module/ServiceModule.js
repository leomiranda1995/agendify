const ServicesRepository = require('../repositories/ServicesRepository');
const AgendifyError = require('../../exceptions/AgendifyException');
const UserModule = require('./UserModule');

class ServiceModule {
  async listServices(orderBy, userId) {
    const services = await ServicesRepository.findAll(orderBy, userId);

    return services;
  }

  async listService(id) {
    const service = await ServicesRepository.findById(id);

    return service;
  }

  async createService({
    name, description, price, duration, availability,
    special_requirements, optional, photo1, photo2, photo3, user_id,
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
      duration,
      availability,
      special_requirements,
      optional,
      photo1,
      photo2,
      photo3,
      user_id,
    });

    return service;
  }

  async updateService(id, {
    name, description, price, duration, availability,
    special_requirements, optional, photo1, photo2, photo3,
  }) {
    const serviceExists = await ServicesRepository.findById(id);
    if (!serviceExists) {
      throw new AgendifyError('Service not found', 404);
    }

    const service = await ServicesRepository.update(id, {
      name,
      description,
      price,
      duration,
      availability,
      special_requirements,
      optional,
      photo1,
      photo2,
      photo3,
    });

    return service;
  }

  async deleteService(id) {
    await ServicesRepository.delete(id);
  }
}

module.exports = new ServiceModule();
