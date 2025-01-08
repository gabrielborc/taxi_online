export default class NotFoundError extends Error {
  constructor(message: string = 'Entity not found') {
    super(message);
  }
}