class AgendifyError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'Agendify Error';
    this.statusCode = statusCode;
  }
}

module.exports = AgendifyError;
