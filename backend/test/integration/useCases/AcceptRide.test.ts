import RideDAOMemory from '../../../src/application/db/memory/RideDAOMemory';
import AccountDAOMemory from '../../../src/application/db/memory/AccountDAOMemory';
import RequestRide from '../../../src/core/useCases/RequestRide';
import GetRide from '../../../src/core/useCases/GetRide';
import AcceptRide from '../../../src/core/useCases/AcceptRide';

let accountDAO: AccountDAOMemory;
let rideDAO: RideDAOMemory;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;

const passengerId = '63c7d92a-aa62-4e49-acf7-459c6b2ae430';
const passengerId2 = '63c7d92a-aa62-4e49-acf7-459c6b2ae431';
const driverId = '63c7d92a-aa62-4e49-acf7-459c6b2ae432';

beforeEach(async () => {
  accountDAO = new AccountDAOMemory();
  rideDAO = new RideDAOMemory();
  requestRide = new RequestRide(accountDAO, rideDAO);
  getRide = new GetRide(rideDAO);
  acceptRide = new AcceptRide(accountDAO, rideDAO);

  const accountDatas = {
    accountId: passengerId,
    name: 'Fulano Silva',
    email: 'fulano@gmail.com',
    cpf: '959.600.920-69',
    carPlate: null,
    password: '123',
    isPassenger: true,
    isDriver: false
  };

  await accountDAO.saveAccount(accountDatas);
  await accountDAO.saveAccount({
    ...accountDatas,
    accountId: passengerId2,
    email: 'fulano2@gmail.com',
  });
  await accountDAO.saveAccount({
    ...accountDatas,
    accountId: driverId,
    email: 'fulano3@gmail.com',
    isPassenger: false,
    isDriver: true
  });
}); 

describe('Accept Ride', () => {
  test('should fail acceptance when account is passenger', async () => {
    expect(() => acceptRide.execute('1', passengerId))
      .rejects.toThrow('Account must be from a driver')
  });

  test('should fail acceptance when account is passenger', async () => {
    const inputRide = {
      passengerId,
      fromLat: 1,
      fromLong: 1,
      toLat: 1,
      toLong: 1
    };

    const ride1 = await requestRide.execute(inputRide);
    await acceptRide.execute(ride1.rideId, driverId);
    const ride2 = await requestRide.execute({
      ...inputRide,
      passengerId: passengerId2
    });

    expect(() => acceptRide.execute(ride2.rideId, driverId))
      .rejects.toThrow('Driver already have an active ride');
  });

  test('should be successful in accepting the ride', async () => {
    const inputRide = {
      passengerId,
      fromLat: 1,
      fromLong: 1,
      toLat: 1,
      toLong: 1
    };

    const result = await requestRide.execute(inputRide);
    await acceptRide.execute(result.rideId, driverId);
    const ride = await getRide.execute(result.rideId);

    expect(ride.getStatus()).toEqual('accepted');
  });
});