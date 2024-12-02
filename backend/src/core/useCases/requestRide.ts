import crypto from 'crypto';
import AccountData from './repositories/AccountData';
import RideData from './repositories/RideData';
import DuplicateRecordError from '../entities/errors/DuplicateRecordError';
import BusinessError from '../entities/errors/BusinessError';

export default async function requestRide(
  input: any, 
  accountData: AccountData,
  rideData: RideData
) {
  const passenger = await accountData.findAccountByID(input.passengerId);

  if (!passenger) throw new BusinessError('Account not found');
  if (!passenger.isPassenger) throw new BusinessError('Account is not passeger');

  const isRideInProgress = await rideData.findRideInProgressByPassagerId(passenger.id);
  if (isRideInProgress) throw new DuplicateRecordError('Duplicate ride');

  const rideId = crypto.randomUUID();
  await rideData.createRide({
    ...input,
    id: rideId,
    status: 'requested',
    date: new Date()
  });

  return { rideId };
}

export interface RequestRideData {
  createRide(ride: any): Promise<void>;
}