const ServiceModule = require('../modules/ServiceModule');

class ServiceController {
  async index(request, response) {
    try {
      const { orderBy, userId } = request.query;

      const services = await ServiceModule.listServices(orderBy, userId);

      response.json(services);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async show(request, response) {
    try {
      const { id } = request.params;

      const service = await ServiceModule.listService(id);

      response.json(service);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async store(request, response) {
    try {
      const {
        name, description, price, duration, availability,
        special_requirements, optional, photos, user_id,
      } = request.body;

      const service = await ServiceModule.createService({
        name,
        description,
        price,
        duration,
        availability,
        special_requirements,
        optional,
        photos,
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
        special_requirements, optional, photos,
      } = request.body;

      const service = await ServiceModule.updateService(id, {
        name,
        description,
        price,
        duration,
        availability,
        special_requirements,
        optional,
        photos,
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
