const EventRepository = require('../repositories/EventRepository');
const ProfessionalRepository = require('../repositories/ProfessionalRepository');
const UserModule = require('./UserModule');

class EventModule {
  async listEventsByDate(response, userIdProfessional, date) {
    const user = await UserModule.listUser(response, userIdProfessional);

    const events = await EventRepository.findAll(user.id, date);

    return events;
  }

  async listEvent(response, userId) {
    const event = await EventRepository.findById(userId);

    if (!event) {
      const error = { error: 'Event not found' };
      response.status(404).json(error);
      throw new Error(error);
    }

    return event;
  }

  async createUser(name, email, password, phone, type_user, professional) {
    if (!name) {
      return { error: 'Name is required' };
    }

    const userExists = await EventRepository.findByEmail(email);

    if (userExists) {
      return { error: 'This e-mail is already in use' };
    }

    const user = await EventRepository.create({
      name, email, password, phone, type_user,
    });

    if (type_user === 'P') {
      const userProfessional = await ProfessionalRepository.create(user.id, professional);
      user.professional = userProfessional;
    }

    return user;
  }

  async updateUser(id, {
    name, password, phone, type_user, professional,
  }) {
    const userExists = await EventRepository.findById(id);
    if (!userExists) {
      return { error: 'User not found' };
    }

    if (!name) {
      return { error: 'Name is required' };
    }

    if (userExists.type_user === 'P') {
      const professionalExists = await ProfessionalRepository.findByUserId(id);

      if (!professionalExists) {
        return { error: 'User not found' };
      }
    }

    const user = await EventRepository.update(id, {
      name, password, phone, type_user,
    });

    if (type_user === 'P' && userExists.type_user === 'P') {
      const professionalUpdated = await ProfessionalRepository.update(id, professional);
      user.professional = professionalUpdated;
    } else if (userExists.type_user === 'C' && type_user === 'P') {
      const professionalCreated = await ProfessionalRepository.create(id, professional);
      user.professional = professionalCreated;
    }

    return user;
  }

  async deleteUser(id) {
    await ProfessionalRepository.delete(id);
    await EventRepository.delete(id);
  }
}

module.exports = new EventModule();
