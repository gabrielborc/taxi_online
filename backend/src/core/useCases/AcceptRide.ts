import BusinessError from '../domain/entities/errors/BusinessError';
import GetRide from './GetRide';
import AccountData from './repositories/AccountData';
import RideData from './repositories/RideData';


export default class AcceptRide {
  constructor(
    readonly accountData: AccountData,
    readonly rideData: RideData
  ){}

  async execute(rideId: string, driverId: string) {
    const driver = await this.accountData.findAccountById(driverId);
    if (!driver?.isDriver) throw new BusinessError('Account must be from a driver');

    const hasActiveRide = await this.rideData.hasActiveRideByDriverId(driverId);
    if (hasActiveRide) throw new BusinessError('Driver already have an active ride');

    const ride = await GetRide.get(this.rideData, rideId);
    ride.accept(driverId);

    await this.rideData.updateRide(ride);
  }
}