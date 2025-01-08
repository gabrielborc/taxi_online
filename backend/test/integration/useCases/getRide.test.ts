import RideDAOMemory from '../../../src/application/db/memory/RideDAOMemory';
import GetRide from '../../../src/core/useCases/GetRide';

let rideDAO: RideDAOMemory;
let getRide: GetRide;

beforeEach(async () => {
  rideDAO = new RideDAOMemory();
  getRide = new GetRide(rideDAO);
});

describe('Get ride', () => {
  test('Should get ride', async () => {
    const rideData = {
      rideId: '2064b411-e7d4-4a27-84c5-45ebae61dbb4',
      passengerId: '63c7d92a-aa62-4e49-acf7-459c6b2ae430',
      driverId: null,
      status: 'requested',
      fare: null,
      distance: null,
      fromLat: 1,
      fromLong: 1,
      toLat: 1,
      toLong: 1,
      date: new Date()
    };

    await rideDAO.saveRide(rideData);
    const ride = await getRide.execute(rideData.rideId);

    expect(ride).toEqual(rideData);
  });

  test('Should not find ride', () => {
    const rideID = '61b281b9-e7ec-42ab-8480-4c6f42163a5d';
    expect(() => getRide.execute(rideID)).rejects.toThrow('Ride not found');
  });
});
