const AgendifyError = require('../exceptions/AgendifyException');
const EventRepository = require('../repositories/EventRepository');
const UserModule = require('./UserModule');
const ServiceModule = require('./ServiceModule');

class EventModule {
  async listEventsByDate(userIdProfessional, dateStart, dateEnd/* , agendaDisponivel */) {
    // TODO: retornar além dos agendados os horários livres seria bom
    // TODO: assim como ter uma opção de filtro
    // TODO: somente agendados, somente horáriosl livres
    if (!userIdProfessional) {
      throw new AgendifyError('userIdProfessional is required!', 400);
    }

    if (!dateStart || !dateEnd) {
      throw new AgendifyError('date is required!', 400);
    }

    const user = await UserModule.listUser(userIdProfessional);

    const events = await EventRepository.findAll(user.id, dateStart, dateEnd);

    events.map((event) => {
      event.created = event.created.toLocaleString();
      if (event.updated) {
        event.updated = event.updated.toLocaleString();
      }
      return event;
    });

    return events;
  }

  async listEvent(userId) {
    if (!userId) {
      throw new AgendifyError('userId is required!', 400);
    }

    const event = await EventRepository.findById(userId);

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
