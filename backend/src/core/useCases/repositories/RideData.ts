import Ride from '../../domain/entities/Ride';

export default interface RideData {
  findRideById(rideId: string): Promise<Ride|null>;
  hasActiveRideByPassagerId(passagerId: string): Promise<boolean>;
  hasActiveRideByDriverId(driverId: string): Promise<boolean>;
  saveRide(ride: Ride): Promise<void>;
  updateRide(ride: Ride): Promise<void>;
}