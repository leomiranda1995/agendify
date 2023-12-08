const ScheduleConfigModule = require('../modules/ScheduleConfigModule');

class ScheduleConfigController {
  async index(request, response) {
    try {
      const { userIdProfessional } = request.query;

      const scheduleWeekProfessional = await ScheduleConfigModule.listSchedules(
        userIdProfessional,
      );

      response.json(scheduleWeekProfessional);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async show(request, response) {
    try {
      const { schedule_id } = request.params;

      const schedule = await ScheduleConfigModule.listSchedule(schedule_id);

      response.json(schedule);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async store(request, response) {
    try {
      const {
        userIdProfessional,
      } = request.body;

      const schedule = await ScheduleConfigModule.createDefaultSchedule(userIdProfessional);

      response.json(schedule);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }

  async update(request, response) {
    try {
      const { id } = request.params;

      const { work = 'S', startTimes = ['08:00', '10:00', '13:00', '15:00', '17:00'] } = request.body;

      const schedule = await ScheduleConfigModule.update(id, { work, startTimes });

      response.json(schedule);
    } catch (e) {
      response.status(e.statusCode || 500).json({ error: e.message } || 'Internal Server Error!');
    }
  }
}

module.exports = new ScheduleConfigController();
