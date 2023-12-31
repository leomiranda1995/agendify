const EventModule = require('../modules/EventModule');

class EventController {
  async index(request, response) {
    try {
      const {
        userProfessionalId, startDate, endDate,
      } = request.body;

      const events = await EventModule.listEventsByDate(userProfessionalId, startDate, endDate);
      response.json(events);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async eventsClient(request, response) {
    try {
      const {
        userIdClient,
      } = request.body;

      const events = await EventModule.listEventsClient(userIdClient);
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
        clientName,
        clientPhone,
        clientEmail,
        serviceId,
        serviceDescription,
        servicePrice,
        eventDescription,
        dateEvent,
        startTime,
        observation,
        color,
      } = request.body;

      const event = await EventModule.createEvent(
        userIdProfessional,
        userIdClient,
        clientName,
        clientPhone,
        clientEmail,
        serviceId,
        serviceDescription,
        servicePrice,
        eventDescription,
        dateEvent,
        startTime,
        observation,
        color,
      );

      response.json(event);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async quality(request, response) {
    try {
      const {
        id,
        quality,
      } = request.body;

      const event = await EventModule.qualityEvent(
        id,
        quality,
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
        clientName,
        clientPhone,
        clientEmail,
        serviceDescription,
        servicePrice,
        eventDescription,
        dateEvent,
        startTime,
        status,
        observation,
        color,
      } = request.body;

      const eventUpdated = await EventModule.updateEvent(id, {
        clientName,
        clientPhone,
        clientEmail,
        serviceDescription,
        servicePrice,
        eventDescription,
        dateEvent,
        startTime,
        status,
        observation,
        color,
      });

      response.json(eventUpdated);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async updateEventProfessional(request, response) {
    try {
      const { id } = request.params;
      const {
        newPrice,
        newDateEvent,
        newStartTime,
      } = request.body;

      const eventUpdated = await EventModule.updateEventProfessional(id, {
        newPrice,
        newDateEvent,
        newStartTime,
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
