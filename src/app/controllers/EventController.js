const EventModule = require('../module/EventModule');

class EventController {
  async index(request, response) {
    try {
      const {
        userProfessionalId, date,
      } = request.body;

      const events = await EventModule.listEventsByDate(response, userProfessionalId, date);
      response.json(events);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async show(request, response) {
    const { eventId } = request.params;

    const event = await EventModule.listEvent(response, eventId);

    response.json(event);
  }

  async store(request, response) {
    const {
      name, email, password, phone, type_user, professional,
    } = request.body;

    const retorno = await EventModule.createUser(
      name,
      email,
      password,
      phone,
      type_user,
      professional,
    );

    if (retorno.error) {
      return response.status(400).json(retorno.error);
    }

    response.json(retorno);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name, password, phone, type_user, professional,
    } = request.body;

    const retorno = await EventModule.updateUser(id, {
      name, password, phone, type_user, professional,
    });

    if (retorno.error) {
      return response.status(404).json(retorno.error);
    }

    response.json(retorno);
  }

  async delete(request, response) {
    const { id } = request.params;

    await EventModule.deleteUser(id);

    response.sendStatus(204);
  }
}

module.exports = new EventController();
