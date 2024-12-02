import RideDAOMemory from '../../../src/application/db/memory/RideDAOMemory';
import getRide from '../../../src/core/useCases/getRide';

let rideDAO: RideDAOMemory;

beforeEach(async () => {
  rideDAO = new RideDAOMemory();
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

    await rideDAO.createRide(rideData);
    const ride = await getRide(rideData.rideId, rideDAO);

    expect(ride).toEqual(rideData);
  });

  test('Should not find ride', () => {
    const rideID = '61b281b9-e7ec-42ab-8480-4c6f42163a5d';
    expect(() => getRide(rideID, rideDAO)).rejects.toThrow('Ride not found');
  });
});
