const AgendifyError = require('../exceptions/AgendifyException');
const ScheduleConfigRepository = require('../repositories/ScheduleConfigRepository');

class ScheduleConfigModule {
  async listSchedules(userIdProfessional) {
    const scheduleWeekProfessional = await ScheduleConfigRepository.findAll(
      userIdProfessional,
    );

    return scheduleWeekProfessional;
  }

  async listSchedule(scheduleId) {
    const scheduleWeekDay = await ScheduleConfigRepository.findById(scheduleId);

    if (!scheduleWeekDay) {
      throw new AgendifyError('Schedule WeekDay not found', 404);
    }

    return scheduleWeekDay;
  }

  async createDefaultSchedule(userIdProfessional) {
    // const user = await UserModule.listUser(userIdProfessional);

    // if (!user.profissional) {
    //   throw new AgendifyError('User is not professional!', 401);
    // }

    const scheduleProfessional = await this.listSchedules(userIdProfessional);

    if (!scheduleProfessional.length === 0) {
      throw new AgendifyError('professional already has an agenda set up', 401);
    }

    const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const startTimes = ['08:00', '10:00', '13:00', '15:00', '17:00'];

    const schedule = await Promise.all(weekDays.map(async (weekDay, indice) => {
      const weekDayTimes = {
        userIdProfessional,
        weekDay,
        indice,
        work: !(weekDay === 'sunday' || weekDay === 'saturday'),
        startTimes,
      };

      const scheduleWeekDay = await ScheduleConfigRepository.create(weekDayTimes);

      return scheduleWeekDay;
    }));

    return schedule;
  }

  async update(id, { work, startTimes }) {
    const scheduleWeekDay = await this.listSchedule(id);

    const scheduleUpdated = await ScheduleConfigRepository.update(id, {
      userIdProfessional: scheduleWeekDay.useridprofessional,
      weekDay: scheduleWeekDay.weekday,
      work,
      startTimes,
    });
    return scheduleUpdated;
  }
}

module.exports = new ScheduleConfigModule();
