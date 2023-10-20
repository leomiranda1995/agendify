const ProfessionalRepository = require('../repositories/ProfessionalRepository');

class ProfessionalController {
  async index(request, response) {
    const { orderBy } = request.query;

    const professional = await ProfessionalRepository.findAll(orderBy);

    response.json(professional);
  }

  async show(request, response) {
    const { id } = request.params;

    const professional = await ProfessionalRepository.findById(id);

    if (!professional) {
      return response.status(404).json({ error: 'Professional not found' });
    }

    response.json(professional);
  }

  async store(request, response) {
    const {
      name, email, password, activity, description, location, phone, base_price, payment_methods,
    } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const professionalExists = await ProfessionalRepository.findByEmail(email);

    if (professionalExists) {
      return response.status(400).json({ error: 'This e-mail is already in use' });
    }

    const professional = await ProfessionalRepository.create({
      name, email, password, activity, description, location, phone, base_price, payment_methods,
    });

    response.json(professional);
  }

  async update(request, response) {
    const { id } = request.params;
    const {
      name, email, password, activity, description, location, phone, base_price, payment_methods,
    } = request.body;

    const professionalExists = await ProfessionalRepository.findById(id);
    if (!professionalExists) {
      return response.status(404).json({ error: 'Professional not found' });
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const professionalByEmail = await ProfessionalRepository.findByEmail(email);
    if (professionalByEmail && professionalByEmail.id !== id) {
      return response.status(400).json({ error: 'This e-mail is already in use' });
    }

    const professional = await ProfessionalRepository.update(id, {
      name, email, password, activity, description, location, phone, base_price, payment_methods,
    });

    response.json(professional);
  }

  async delete(request, response) {
    const { id } = request.params;

    await ProfessionalRepository.delete(id);
    response.sendStatus(204);
  }
}

module.exports = new ProfessionalController();
