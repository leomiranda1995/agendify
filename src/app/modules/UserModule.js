const AgendifyError = require('../exceptions/AgendifyException');
const UserRepository = require('../repositories/UserRepository');
const ProfessionalRepository = require('../repositories/ProfessionalRepository');

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
    name, email, password, phone, type_user, professional,
  }) {
    if (!name) {
      throw new AgendifyError('Name is required!', 404);
    }

    const userExists = await UserRepository.findByEmail(email);
    if (userExists) {
      throw new AgendifyError('This e-mail is already in use', 404);
    }

    const user = await UserRepository.create({
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
    await UserRepository.delete(id);
  }
}

module.exports = new UserModule();
