export default class DuplicateRecordError extends Error {
  constructor(message: string = 'Duplicate record') {
    super(message);
  }
}