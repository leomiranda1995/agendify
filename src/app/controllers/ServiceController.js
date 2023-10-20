const ServicesRepository = require('../repositories/ServicesRepository');

class ServiceController {
  async index(request, response) {
    const { orderBy } = request.query;

    const services = await ServicesRepository.findAll(orderBy);

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

  async showByProfessional(request, response) {
    const { id } = request.params;

    const services = await ServicesRepository.findByIdProfessional(id);

    response.json(services);
  }

  async store(request, response) {
    const {
      name, description, price, duration, availability,
      special_requirements, optional, professional_id,
    } = request.body;

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
      professional_id,
    });

    response.json(service);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name, description, price, duration, availability,
      special_requirements, optional, professional_id,
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
      professional_id,
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
