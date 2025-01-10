import RideDAOMemory from '../../../src/application/db/memory/RideDAOMemory';
import AccountDAOMemory from '../../../src/application/db/memory/AccountDAOMemory';
import RequestRide from '../../../src/core/useCases/RequestRide';
import GetRide from '../../../src/core/useCases/GetRide';
import AcceptRide from '../../../src/core/useCases/AcceptRide';
import StartRide from '../../../src/core/useCases/StartRide';

let accountDAO: AccountDAOMemory;
let rideDAO: RideDAOMemory;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

const passengerId = '63c7d92a-aa62-4e49-acf7-459c6b2ae430';
const driverId = '63c7d92a-aa62-4e49-acf7-459c6b2ae432';

beforeEach(async () => {
  accountDAO = new AccountDAOMemory();
  rideDAO = new RideDAOMemory();
  requestRide = new RequestRide(accountDAO, rideDAO);
  getRide = new GetRide(rideDAO);
  acceptRide = new AcceptRide(accountDAO, rideDAO);
  startRide = new StartRide(rideDAO);

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
    accountId: driverId,
    email: 'fulano3@gmail.com',
    isPassenger: false,
    isDriver: true
  });
}); 

describe('Start Ride', () => {
  test('should fail starting ride when ride is not status accepted', async () => {
    const inputRide = {
      passengerId,
      fromLat: 1,
      fromLong: 1,
      toLat: 1,
      toLong: 1
    };

    const ride = await requestRide.execute(inputRide);

    expect(() => startRide.execute(ride.rideId)).rejects.toThrow('Ride status is invalid');
  });

  test('should start ride with successfully', async () => {
    const inputRide = {
      passengerId,
      fromLat: 1,
      fromLong: 1,
      toLat: 1,
      toLong: 1
    };

    const result = await requestRide.execute(inputRide);
    await acceptRide.execute(result.rideId, driverId);
    await startRide.execute(result.rideId);
    const ride = await getRide.execute(result.rideId);

    expect(ride.getStatus()).toEqual('in_progress');
  });
});