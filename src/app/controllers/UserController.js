const UserModule = require('../module/UserModule');

class UserController {
  async index(request, response) {
    const { orderBy, userTypeFilter } = request.query;

    const usersWithProfessional = await UserModule.listUsers(orderBy, userTypeFilter);

    response.json(usersWithProfessional);
  }

  async show(request, response) {
    const { user_id } = request.params;

    const retorno = await UserModule.listUser(user_id);

    if (retorno.error) {
      return response.status(404).json(retorno.error);
    }

    response.json(retorno);
  }

  async store(request, response) {
    const {
      name, email, password, phone, type_user, professional,
    } = request.body;

    const retorno = await UserModule.createUser(
      name,
      email,
      password,
      phone,
      type_user,
      professional,
    );

    if (retorno.error) {
      return response.status(400).json(retorno.error);
    }

    response.json(retorno);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name, password, phone, type_user, professional,
    } = request.body;

    const retorno = await UserModule.updateUser(id, {
      name, password, phone, type_user, professional,
    });

    if (retorno.error) {
      return response.status(404).json(retorno.error);
    }

    response.json(retorno);
  }

  async delete(request, response) {
    const { id } = request.params;

    await UserModule.deleteUser(id);

    response.sendStatus(204);
  }
}

module.exports = new UserController();
