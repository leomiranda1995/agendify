const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const AgendifyError = require('../exceptions/AgendifyException');
const UserRepository = require('../repositories/UserRepository');
const ProfessionalRepository = require('../repositories/ProfessionalRepository');
const ScheduleConfigRepository = require('../repositories/ScheduleConfigRepository');
const ScheduleConfigModule = require('./ScheduleConfigModule');

class UserModule {
  async listUsers(orderBy = 'ASC', userTypeFilter = '') {
    const users = await UserRepository.findAll(orderBy, userTypeFilter);

    const usersWithProfessional = await Promise.all(
      users.map(async (user) => {
        const professional = await ProfessionalRepository.findByUserId(user.id);
        user.professional = professional;
        return user;
      }),
    );

    return usersWithProfessional;
  }

  async listUser(userId) {
    const user = await UserRepository.findById(userId);

    if (!user) {
      throw new AgendifyError('User not found', 404);
    }

    const professional = await ProfessionalRepository.findByUserId(user.id);
    user.professional = professional;

    return user;
  }

  async createUser({
    name, email, password, photo, phone, type_user, professional,
  }) {
    if (!name) {
      throw new AgendifyError('Name is required!', 404);
    }

    const userExists = await UserRepository.findByEmail(email);
    if (userExists) {
      throw new AgendifyError('This e-mail is already in use', 404);
    }

    password = await bcrypt.hash(password, 10);

    const user = await UserRepository.create({
      name, email, password, photo, phone, type_user,
    });

    if (type_user === 'P') {
      const userProfessional = await ProfessionalRepository.create(user.id, professional);
      user.professional = userProfessional;

      const schedule = await ScheduleConfigModule.createDefaultSchedule(user.id);

      user.professional.schedule = schedule;
    }

    return user;
  }

  async updateUser(id, {
    name, photo, phone, status = 'A', type_user, professional,
  }) {
    const userExists = await UserRepository.findById(id);
    if (!userExists) {
      throw new AgendifyError('User not found', 404);
    }

    if (!name) {
      throw new AgendifyError('Name is required', 404);
    }

    if (userExists.type_user === 'P') {
      const professionalExists = await ProfessionalRepository.findByUserId(id);

      if (!professionalExists) {
        throw new AgendifyError('User not found', 404);
      }
    }

    const user = await UserRepository.update(id, {
      name, photo, phone, status, type_user,
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
    await ScheduleConfigRepository.deleteScheduleProfessionalId(id);
    await ProfessionalRepository.delete(id);
    await UserRepository.delete(id);
  }

  async login(email, password) {
    if (!email) {
      throw new AgendifyError('Email is required!', 404);
    }

    if (!password) {
      throw new AgendifyError('Password is required!', 404);
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AgendifyError('Incorrect email or password', 401);
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AgendifyError('Incorrect email or password', 401);
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    return { auth: true, token };
  }

  async updatePassword(id, { newPassword }) {
    const userExists = await UserRepository.findById(id);

    if (!userExists) {
      throw new AgendifyError('User not found', 404);
    }

    newPassword = await bcrypt.hash(newPassword, 10);

    const user = await UserRepository.updatePassword(id, { newPassword });

    return user;
  }
}

module.exports = new UserModule();
