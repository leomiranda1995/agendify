// const moment = require('moment');
const moment = require('moment');
const AgendifyError = require('../exceptions/AgendifyException');
const userModule = require('./UserModule');
const ScheduleConfigModule = require('./ScheduleConfigModule');
const EventModule = require('./EventModule');

class ScheduleModule {
  async listScheduleProfessional(userIdProfessional, startDate = '2023-12-05', endDate = '2023-12-05') {
    const user = await userModule.listUser(userIdProfessional);

    if (!user.professional) {
      throw new AgendifyError('user is not professional', 400);
    }

    const scheduleConfig = await ScheduleConfigModule.listSchedules(user.id);
    const events = await EventModule.listEventsByDate(user.id, startDate, endDate);

    const schedule = [];

    const startMoment = moment(startDate);
    const endMoment = moment(endDate);

    while (startMoment.isSameOrBefore(endMoment, 'day')) {
      const newSchedule = {};
      newSchedule.dia = startMoment.format('YYYY-MM-DD');
      newSchedule.weekDay = startMoment.format('dddd').toLowerCase();

      const [timesConfig] = scheduleConfig.filter((config) => (
        config.weekday === newSchedule.weekDay
      ));

      newSchedule.events = timesConfig.starttimes.map((time) => {
        const aux = {};
        aux.time = time;
        aux.event = events.find((event) => {
          const teste = moment(event.dateevent).format('YYYY-MM-DD');
          return (teste === newSchedule.dia && event.starttime === time);
        });

        return aux;
      });

      const eventsNotInTimesConfig = events.filter((event) => (
        moment(event.dateevent).format('YYYY-MM-DD') === newSchedule.dia
            && !newSchedule.events.find((scheduleEvent) => scheduleEvent.time === event.starttime)
      ));

      eventsNotInTimesConfig.forEach((eventNotInTimesConfig) => {
        newSchedule.events.push({
          time: eventNotInTimesConfig.starttime,
          event: eventNotInTimesConfig,
        });
      });

      schedule.push(newSchedule);

      startMoment.add(1, 'day');
    }

    return schedule;
  }

  async teste(userIdProfessional, startDate = '2023-12-05', endDate = '2023-12-05') {
    const user = await userModule.listUser(userIdProfessional);

    if (!user.professional) {
      throw new AgendifyError('user is not professional', 400);
    }

    const events = await EventModule.listEventsByDate(user.id, startDate, endDate);

    const eventsResult = events.filter((event) => {
      const teste = moment(event.dateevent).format('YYYY-MM-DD');
      return !(teste === '2023-12-05' && event.starttime === '17:00');
    });

    return eventsResult;
  }
}

module.exports = new ScheduleModule();
