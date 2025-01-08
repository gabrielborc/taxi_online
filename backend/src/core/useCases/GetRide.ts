import NotFoundError from '../domain/entities/errors/NotFoundError';
import RideData from './repositories/RideData';

export default class GetRide {
  constructor(readonly rideData: RideData) {}

  async execute(rideId: string) {
    const ride = await this.rideData.findRideById(rideId);

    if (!ride) throw new NotFoundError('Ride not found');

    return ride;
  }
}
