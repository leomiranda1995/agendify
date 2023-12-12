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

    await Promise.all(
      events.map(async (event) => {
        event.useridprofessional = await UserModule.listUser(event.useridprofessional);
        // event.useridclient = await UserModule.listUser(event.useridclient);
        event.serviceid = await ServiceModule.listService(event.serviceid);

        event.created = event.created.toLocaleString();
        if (event.updated) {
          event.updated = event.updated.toLocaleString();
        }

        return event;
      }),
    );

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

  async createEvent(
    userIdProfessional,
    userIdClient,
    serviceId,
    dateEvent,
    startTime,
    observation,
    color,
  ) {
    if (!userIdProfessional) {
      throw new AgendifyError('userIdProfessional is required!', 400);
    }

    if (!userIdClient) {
      throw new AgendifyError('userIdClient is required!', 400);
    }

    if (!serviceId) {
      throw new AgendifyError('serviceId is required!', 400);
    }

    if (!dateEvent) {
      throw new AgendifyError('dateEvent is required!', 400);
    }

    if (!startTime) {
      throw new AgendifyError('startTime is required!', 400);
    }

    const userProfessional = await UserModule.listUser(userIdProfessional);
    const userClient = await UserModule.listUser(userIdClient);
    const service = await ServiceModule.listService(serviceId);

    // TODO: função para validar se a data e hora está livre na agenda do profissional

    const event = await EventRepository.create({
      userIdProfessional: userProfessional.id,
      userIdClient: userClient.id,
      serviceId: service.id,
      dateEvent,
      startTime,
      observation,
      color,
    });

    event.created = event.created.toLocaleString();

    return event;
  }

  async updateEvent(id, {
    userIdClient,
    serviceId,
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

    // TODO: [userIdClient]
    // TODO: Validar se o usuário profissional existe

    // TODO: [serviceId]
    // TODO: Validar se o serviço existe

    // TODO: [status]
    // TODO: Alteração de Status, validar se o novo status está correto

    const eventUpdated = await EventRepository.update(id, {
      userIdClient,
      serviceId,
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
