const AgendifyError = require('../exceptions/AgendifyException');
const EventRepository = require('../repositories/EventRepository');
const UserModule = require('./UserModule');

class EventModule {
  async listEventsByDate(userIdProfessional, date/* , agendaDisponivel */) {
    // TODO: retornar além dos agendados os horários livres seria bom
    // TODO: assim como ter uma opção de filtro
    // TODO: somente agendados, somente horáriosl livres
    if (!userIdProfessional) {
      throw new AgendifyError('userIdProfessional is required!', 400);
    }

    if (!date) {
      throw new AgendifyError('date is required!', 400);
    }

    const user = await UserModule.listUser(userIdProfessional);

    const events = await EventRepository.findAll(user.id, date);

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

    return event;
  }

  async createEvent(
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
  ) {
    if (!userIdProfessional) {
      throw new AgendifyError('userIdProfessional is required!', 400);
    }

    if (!userIdClient) {
      throw new AgendifyError('userIdClient is required!', 400);
    }

    if (!dateEvent) {
      throw new AgendifyError('dateEvent is required!', 400);
    }

    if (!startTime) {
      throw new AgendifyError('startTime is required!', 400);
    }

    if (!endTime) {
      throw new AgendifyError('endTime is required!', 400);
    }

    if (!summary) {
      throw new AgendifyError('summary is required!', 400);
    }

    if (!description) {
      throw new AgendifyError('description is required!', 400);
    }

    const event = await EventRepository.create({
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
    });

    return event;
  }

  async updateEvent(id, {
    // userIdProfessional,
    // userIdClient,
    dateEvent,
    startTime,
    endTime,
    status,
    summary,
    description,
    color,
  }) {
    const event = this.listEvent(id);
    if (!event) {
      throw new AgendifyError('Event not found!', 404);
    }

    // TODO: Criar função que recebe [dateEvent, startTime, endTime] e retorne se está livre
    // TODO: Se recebeu as props [dateEvent, startTime, endTime] validar com a função acima

    // TODO: Criar função para buscar se o novo cliente possui um agendamento no mesmo horário
    // TODO: Usar a função acima para permitir alteração de cliente

    // TODO: Alteração de Status, validar se o novo status está correto

    const eventUpdated = await EventRepository.update(id, {
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

    return eventUpdated;
  }

  async deleteEvent(id) {
    await EventRepository.delete(id);
  }
}

module.exports = new EventModule();
