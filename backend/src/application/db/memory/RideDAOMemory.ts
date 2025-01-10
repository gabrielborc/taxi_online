import Ride from "../../../core/domain/entities/Ride";
import RideData from "../../../core/useCases/repositories/RideData";

export default class RideDAOMemory implements RideData {
  private data: any[] = [];

  async findRideById(rideId: string): Promise<Ride|null> {
    return this.data.find((ride) => ride.rideId === rideId);
  }
  
  async hasActiveRideByPassagerId(passengerId: string): Promise<boolean> {
    return this.data.some((ride) => ride.passengerId === passengerId && ride.status !== 'completed' );
  }

  async hasActiveRideByDriverId(driverId: string): Promise<boolean> {
    return this.data.some((ride) => ride.driverId === driverId && ['accepted', 'in_progress'].includes(ride.status));
  }

  async saveRide(ride: Ride): Promise<void> {
    this.data.push(ride);
  }

  async updateRide(ride: Ride): Promise<void> {
    const rideIndex = this.data.findIndex(({rideId}) => rideId === ride.rideId);
    this.data[rideIndex] = ride;
  }
}