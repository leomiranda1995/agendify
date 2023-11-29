const ServicesRepository = require('../repositories/ServicesRepository');
const ServicesModule = require('../module/ServiceModule');
const ServiceModule = require('../module/ServiceModule');

class ServiceController {
  async index(request, response) {
    try {
      const { orderBy, userId } = request.query;

      const services = await ServicesModule.listServices(orderBy, userId);

      response.json(services);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async show(request, response) {
    try {
      const { id } = request.params;

      const service = await ServicesRepository.findById(id);

      if (!service) {
        return response.status(404).json({ error: 'Service not found' });
      }

      response.json(service);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async store(request, response) {
    try {
      const {
        name, description, price, duration, availability,
        special_requirements, optional, photo1, photo2, photo3, user_id,
      } = request.body;

      const service = await ServiceModule.createService({
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
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async update(request, response) {
    try {
      const { id } = request.params;
      const {
        name, description, price, duration, availability,
        special_requirements, optional, photo1, photo2, photo3,
      } = request.body;

      const service = await ServiceModule.updateService(id, {
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
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params;

      await ServiceModule.deleteService(id);
      response.sendStatus(204);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }
}

module.exports = new ServiceController();
