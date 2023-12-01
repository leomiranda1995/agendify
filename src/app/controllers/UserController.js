const UserModule = require('../modules/UserModule');

class UserController {
  async index(request, response) {
    try {
      const { orderBy, userTypeFilter } = request.query;

      const usersWithProfessional = await UserModule.listUsers(orderBy, userTypeFilter);

      response.json(usersWithProfessional);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async show(request, response) {
    try {
      const { user_id } = request.params;

      const user = await UserModule.listUser(user_id);

      response.json(user);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async store(request, response) {
    try {
      const {
        name, email, password, photo, phone, type_user, professional,
      } = request.body;

      const user = await UserModule.createUser({
        name,
        email,
        password,
        photo,
        phone,
        type_user,
        professional,
      });

      // criar padrão agenda...

      response.json(user);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async update(request, response) {
    try {
      const { id } = request.params;
      const {
        name, password, photo, phone, status, type_user, professional,
      } = request.body;

      const userUpdated = await UserModule.updateUser(id, {
        name, password, photo, phone, status, type_user, professional,
      });

      response.json(userUpdated);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async delete(request, response) {
    try {
      const { id } = request.params;

      await UserModule.deleteUser(id);

      response.sendStatus(204);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async login(request, response) {
    try {
      const { email, password } = request.body;

      const token = await UserModule.login(email, password);

      response.json(token);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }
}

module.exports = new UserController();
