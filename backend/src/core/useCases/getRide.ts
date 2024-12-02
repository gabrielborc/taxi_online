import NotFoundError from '../entities/errors/NotFoundError';
import RideData from './repositories/RideData';

export default async function getRide(rideId: string, rideData: RideData) {
  const ride = await rideData.findRideByID(rideId);

  if (!ride) throw new NotFoundError('Ride not found');

  return ride;
}
