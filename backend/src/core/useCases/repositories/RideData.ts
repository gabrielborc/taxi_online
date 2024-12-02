export default interface RideData {
  findRideByID(rideID: string): Promise<any>;
  findRideInProgressByPassagerId(passagerId: string): Promise<any>;
  createRide(ride: any): Promise<void>;
}