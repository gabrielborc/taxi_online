import NotFoundError from '../domain/entities/errors/NotFoundError';
import Ride from '../domain/entities/Ride';
import RideData from './repositories/RideData';

export default class GetRide {
  constructor(readonly rideData: RideData) {}

  async execute(rideId: string): Promise<Ride> {
    const ride = await this.rideData.findRideById(rideId);
    if (!ride) throw new NotFoundError('Ride not found');
    return ride;
  }

  static async get(rideData: RideData, rideId: string) {
    const ride = await rideData.findRideById(rideId);
    if (!ride) throw new NotFoundError('Ride not found');
    return ride;
  }
}
