import RideData from "../../../core/useCases/repositories/RideData";


export default class RideDAOMemory implements RideData {
  private data: any[] = [];

  async findRideByID(rideID: string): Promise<any> {
    return this.data.find((ride) => ride.rideId === rideID);
  }
  
  async findRideInProgressByPassagerId(passagerId: string): Promise<any> {
    return this.data.some((ride) => ride.passsengerId = passagerId && ride.status !== 'completed' );
  }

  async createRide(ride: any): Promise<void> {
    this.data.push(ride);
  }
}