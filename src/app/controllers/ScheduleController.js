const ScheduleModule = require('../modules/ScheduleModule');

class ScheduleController {
  async listScheduleProfessional(request, response) {
    try {
      const {
        userIdProfessional,
        startDate,
        endDate,
      } = request.body;

      const scheduleProfessional = await ScheduleModule.listScheduleProfessional(
        userIdProfessional,
        startDate,
        endDate,
      );

      response.json(scheduleProfessional);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async listScheduleProfessionalForClient(request, response) {
    try {
      const {
        userIdProfessional,
        startDate,
        endDate,
      } = request.body;

      const scheduleProfessional = await ScheduleModule.listScheduleProfessional(
        userIdProfessional,
        startDate,
        endDate,
        true,
      );

      response.json(scheduleProfessional);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }
}

module.exports = new ScheduleController();
