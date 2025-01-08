import Ride from '../../domain/entities/Ride';

export default interface RideData {
  findRideById(rideId: string): Promise<Ride|null>;
  findRideInProgressByPassagerId(passagerId: string): Promise<boolean>;
  saveRide(ride: Ride): Promise<void>;
}