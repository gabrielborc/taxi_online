import AccountData from './repositories/AccountData';
import RideData from './repositories/RideData';
import DuplicateRecordError from '../domain/entities/errors/DuplicateRecordError';
import BusinessError from '../domain/entities/errors/BusinessError';
import Ride from '../domain/entities/Ride';

export default class RequestRide {
  constructor(
    readonly accountData: AccountData,
    readonly rideData: RideData
  ) {}

  async execute(input: any) {
    const passenger = await this.accountData.findAccountById(input.passengerId);
    if (!passenger) throw new BusinessError('Account not found');
    if (!passenger.isPassenger) throw new BusinessError('Account must be from a passenger');

    const hasActiveRide = await this.rideData.hasActiveRideByPassagerId(passenger.accountId);
    if (hasActiveRide) throw new DuplicateRecordError('Passenger already have an active ride');

    const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong)
    await this.rideData.saveRide(ride);

    return { rideId: ride.rideId };
  }
}
