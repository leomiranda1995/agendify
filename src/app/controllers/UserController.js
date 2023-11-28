const UserRepository = require('../repositories/UserRepository');
const ProfessionalRepository = require('../repositories/ProfessionalRepository');

class UserController {
  async index(request, response) {
    const { orderBy, userTypeFilter } = request.query;

    const users = await UserRepository.findAll(orderBy, userTypeFilter);

    const usersWithProfessional = await Promise.all(
      users.map(async (user) => {
        const professional = await ProfessionalRepository.findByUserId(user.id);
        user.professional = professional;
        return user;
      }),
    );

    response.json(usersWithProfessional);
  }

  async show(request, response) {
    const { user_id } = request.params;

    const user = await UserRepository.findById(user_id);

    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    const professional = await ProfessionalRepository.findByUserId(user.id);
    user.professional = professional;

    response.json(user);
  }

  async store(request, response) {
    const {
      name, email, password, phone, type_user, professional,
    } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const userExists = await UserRepository.findByEmail(email);

    if (userExists) {
      return response.status(400).json({ error: 'This e-mail is already in use' });
    }

    const user = await UserRepository.create({
      name, email, password, phone, type_user,
    });

    if (type_user === 'P') {
      const userProfessional = await ProfessionalRepository.create(user.id, professional);
      user.professional = userProfessional;
    }

    response.json(user);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name, password, phone, type_user, professional,
    } = request.body;

    const userExists = await UserRepository.findById(id);
    if (!userExists) {
      return response.status(404).json({ error: 'User not found' });
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    if (userExists.type_user === 'P') {
      const professionalExists = await ProfessionalRepository.findByIdProfessional(id);

      if (!professionalExists) {
        return response.status(404).json({ error: 'User Professional not found' });
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

    response.json(user);
  }

  async delete(request, response) {
    const { id } = request.params;

    await ProfessionalRepository.delete(id);
    await UserRepository.delete(id);
    response.sendStatus(204);
  }
}

module.exports = new UserController();
