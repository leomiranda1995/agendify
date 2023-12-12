const AgendifyError = require('../exceptions/AgendifyException');
const EventRepository = require('../repositories/EventRepository');
const UserModule = require('./UserModule');
const ServiceModule = require('./ServiceModule');

class EventModule {
  async listEventsByDate(userIdProfessional, startDate, endDate) {
    if (!userIdProfessional) {
      throw new AgendifyError('userIdProfessional is required!', 400);
    }

    if (!startDate || !endDate) {
      throw new AgendifyError('date is required!', 400);
    }

    const user = await UserModule.listUser(userIdProfessional);

    const events = await EventRepository.findAllProfessional(user.id, startDate, endDate);

    events.map((event) => {
      event.created = event.created.toLocaleString();
      if (event.updated) {
        event.updated = event.updated.toLocaleString();
      }
      return event;
    });

    return events;
  }

  async listEventsClient(userIdClient) {
    if (!userIdClient) {
      throw new AgendifyError('userIdClient is required!', 400);
    }

    const user = await UserModule.listUser(userIdClient);

    const events = await EventRepository.findAllClient(user.id);

    events.map((event) => {
      event.created = event.created.toLocaleString();
      if (event.updated) {
        event.updated = event.updated.toLocaleString();
      }
      return event;
    });

    return events;
  }

  async listEvent(eventId) {
    if (!eventId) {
      throw new AgendifyError('eventId is required!', 400);
    }

    const event = await EventRepository.findById(eventId);

    if (!event) {
      throw new AgendifyError('Event not found', 404);
    }

    event.created = event.created.toLocaleString();
    if (event.updated) {
      event.updated = event.updated.toLocaleString();
    }

    return event;
  }

  async listEventByDateStartTime(userIdProfessional, dateEvent, startTime) {
    const event = await EventRepository.findByProfessionalDateStartTime(
      userIdProfessional,
      dateEvent,
      startTime,
    );

    return event;
  }

  async createEvent(
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
  ) {
    if (!userIdProfessional) {
      throw new AgendifyError('userIdProfessional is required!', 400);
    }

    if (!dateEvent) {
      throw new AgendifyError('dateEvent is required!', 400);
    }

    if (!startTime) {
      throw new AgendifyError('startTime is required!', 400);
    }

    const eventDateStartTimeExists = await this.listEventByDateStartTime(
      userIdProfessional,
      dateEvent,
      startTime,
    );

    if (eventDateStartTimeExists) {
      throw new AgendifyError('Unavailable hours for this professional', 400);
    }

    const userProfessional = await UserModule.listUser(userIdProfessional);

    if (userIdClient) {
      const userClient = await UserModule.listUser(userIdClient);
      clientName = userClient.name;
      clientPhone = userClient.phone;
      clientEmail = userClient.email;
    }

    if (serviceId) {
      const service = await ServiceModule.listService(serviceId);
      serviceDescription = service.description;
      servicePrice = service.price;
    }

    eventDescription = `${clientName} - ${serviceDescription}`;

    const event = await EventRepository.create({
      userIdProfessional: userProfessional.id,
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
    });

    event.created = event.created.toLocaleString();

    return event;
  }

  async updateEvent(id, {
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
  }) {
    const event = await this.listEvent(id);
    if (!event) {
      throw new AgendifyError('Event not found!', 404);
    }

    const eventDateStartTimeExists = await this.listEventByDateStartTime(
      event.useridprofessional,
      dateEvent,
      startTime,
    );

    if (eventDateStartTimeExists && eventDateStartTimeExists.id !== id) {
      throw new AgendifyError('Unavailable hours for this professional', 400);
    }

    // TODO: [status]
    // TODO: Alteração de Status, validar se o novo status está correto

    const eventUpdated = await EventRepository.update(id, {
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

    eventUpdated.created = eventUpdated.created.toLocaleString();
    eventUpdated.updated = eventUpdated.updated.toLocaleString();

    return eventUpdated;
  }

  async deleteEvent(id) {
    await EventRepository.delete(id);
  }
}

module.exports = new EventModule();
