import Ride from "../../../core/domain/entities/Ride";
import RideData from "../../../core/useCases/repositories/RideData";


export default class RideDAOMemory implements RideData {
  private data: any[] = [];

  async findRideById(rideId: string): Promise<Ride|null> {
    return this.data.find((ride) => ride.rideId === rideId);
  }
  
  async findRideInProgressByPassagerId(passagerId: string): Promise<boolean> {
    return this.data.some((ride) => ride.passsengerId = passagerId && ride.status !== 'completed' );
  }

  async saveRide(ride: any): Promise<void> {
    this.data.push(ride);
  }
}