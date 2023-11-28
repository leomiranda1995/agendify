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
      return { error: 'User not found' };
    }

    const professional = await ProfessionalRepository.findByUserId(user.id);
    user.professional = professional;

    return user;
  }

  async createUser(name, email, password, phone, type_user, professional) {
    if (!name) {
      return { error: 'Name is required' };
    }

    const userExists = await UserRepository.findByEmail(email);

    if (userExists) {
      return { error: 'This e-mail is already in use' };
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
