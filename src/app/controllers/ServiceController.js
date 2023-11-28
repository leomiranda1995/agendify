const ServicesRepository = require('../repositories/ServicesRepository');
const UserModule = require('../module/UserModule');

class ServiceController {
  async index(request, response) {
    const { orderBy, userId } = request.query;

    const services = await ServicesRepository.findAll(orderBy, userId);

    response.json(services);
  }

  async show(request, response) {
    const { id } = request.params;

    const service = await ServicesRepository.findById(id);

    if (!service) {
      return response.status(404).json({ error: 'Service not found' });
    }

    response.json(service);
  }

  async store(request, response) {
    const {
      name, description, price, duration, availability,
      special_requirements, optional, photo1, photo2, photo3, user_id,
    } = request.body;

    const user = await UserModule.listUser(user_id);

    if (user.error) {
      return response.status(400).json(user.error);
    }

    if (!user.professional) {
      return response.status(400).json({ error: 'User is not professional' });
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
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

    response.json(service);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name, description, price, duration, availability,
      special_requirements, optional, photo1, photo2, photo3,
    } = request.body;

    const serviceExists = await ServicesRepository.findById(id);
    if (!serviceExists) {
      return response.status(404).json({ error: 'Service not found' });
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
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

    response.json(service);
  }

  async delete(request, response) {
    const { id } = request.params;

    await ServicesRepository.delete(id);
    response.sendStatus(204);
  }
}

module.exports = new ServiceController();
