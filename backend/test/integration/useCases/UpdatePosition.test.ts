import RideDAOMemory from '../../../src/application/db/memory/RideDAOMemory';
import AccountDAOMemory from '../../../src/application/db/memory/AccountDAOMemory';
import RequestRide from '../../../src/core/useCases/RequestRide';
import GetRide from '../../../src/core/useCases/GetRide';
import AcceptRide from '../../../src/core/useCases/AcceptRide';
import StartRide from '../../../src/core/useCases/StartRide';
import PositionDAOMemory from '../../../src/application/db/memory/PosistionDAOMemory';
import UpdatePosition from '../../../src/core/useCases/UpdatePosition';

let accountDAO: AccountDAOMemory;
let rideDAO: RideDAOMemory;
let positionDAO: PositionDAOMemory;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;

const passengerId = '63c7d92a-aa62-4e49-acf7-459c6b2ae430';
const driverId = '63c7d92a-aa62-4e49-acf7-459c6b2ae432';

beforeEach(async () => {
  accountDAO = new AccountDAOMemory();
  rideDAO = new RideDAOMemory();
  positionDAO = new PositionDAOMemory();
  requestRide = new RequestRide(accountDAO, rideDAO);
  getRide = new GetRide(rideDAO);
  acceptRide = new AcceptRide(accountDAO, rideDAO);
  startRide = new StartRide(rideDAO);
  updatePosition = new UpdatePosition(rideDAO, positionDAO);

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

describe('Update Position', () => {
  test('should updated position with successfully', async () => {
    const inputRide = {
      passengerId,
      fromLat: 1,
      fromLong: 1,
      toLat: 1,
      toLong: 1
    };

    const outputRequestRide = await requestRide.execute(inputRide);
    await acceptRide.execute(outputRequestRide.rideId, driverId);
    await startRide.execute(outputRequestRide.rideId);
    await updatePosition.execute({
      rideId: outputRequestRide.rideId,
      lat: -27.584905257808835,
		  long: -48.545022195325124
    });
    await updatePosition.execute({
      rideId: outputRequestRide.rideId,
      lat: -27.496887588317275,
		  long: -48.522234807851476
    });
    const ride = await getRide.execute(outputRequestRide.rideId);

    expect(ride.getStatus()).toBe('in_progress');
    expect(ride.getDistance()).toBe(10);
  });
});