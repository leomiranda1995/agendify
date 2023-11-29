const EventModule = require('../modules/EventModule');

class EventController {
  async index(request, response) {
    try {
      const {
        userProfessionalId, date,
      } = request.body;

      const events = await EventModule.listEventsByDate(userProfessionalId, date);
      response.json(events);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async show(request, response) {
    try {
      const { eventId } = request.params;

      const event = await EventModule.listEvent(eventId);

      response.json(event);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async store(request, response) {
    try {
      const {
        userIdProfessional,
        userIdClient,
        dateEvent,
        startTime,
        endTime,
        status,
        updated,
        summary,
        description,
        color,
      } = request.body;

      const event = await EventModule.createEvent(
        userIdProfessional,
        userIdClient,
        dateEvent,
        startTime,
        endTime,
        status,
        updated,
        summary,
        description,
        color,
      );

      response.json(event);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async update(request, response) {
    try {
      const { id } = request.params;
      const {
        // userIdProfessional,
        // userIdClient,
        dateEvent,
        startTime,
        endTime,
        status,
        summary,
        description,
        color,
      } = request.body;

      const eventUpdated = await EventModule.updateEvent(id, {
        // userIdProfessional,
        // userIdClient,
        dateEvent,
        startTime,
        endTime,
        status,
        summary,
        description,
        color,
      });

      response.json(eventUpdated);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async delete(request, response) {
    const { id } = request.params;

    await EventModule.deleteEvent(id);

    response.sendStatus(204);
  }
}

module.exports = new EventController();
