import GetRide from './GetRide';
import RideData from './repositories/RideData';

export default class StartRide {
  constructor(
    readonly rideData: RideData
  ){}

  async execute(rideId: string) {
    const ride = await GetRide.get(this.rideData, rideId);
    ride.startRide()

    await this.rideData.updateRide(ride);
 }
}