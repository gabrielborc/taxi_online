import RideDAOMemory from '../../../src/application/db/memory/RideDAOMemory';
import Ride from '../../../src/core/domain/entities/Ride';
import GetRide from '../../../src/core/useCases/GetRide';

let rideDAO: RideDAOMemory;
let getRide: GetRide;

beforeEach(async () => {
  rideDAO = new RideDAOMemory();
  getRide = new GetRide(rideDAO);
});

describe('Get ride', () => {
  test('Should get ride', async () => {
    const date = new Date();
    const rideData = new Ride(
      '2064b411-e7d4-4a27-84c5-45ebae61dbb4',
      '63c7d92a-aa62-4e49-acf7-459c6b2ae430',
      null,
      1,
      1,
      1,
      1,
      0,
      0,
      'requested',
      date
    );

    await rideDAO.saveRide(rideData);
    const ride = await getRide.execute(rideData.rideId);

    expect(ride).toHaveProperty('rideId', '2064b411-e7d4-4a27-84c5-45ebae61dbb4');
    expect(ride).toHaveProperty('passengerId', '63c7d92a-aa62-4e49-acf7-459c6b2ae430');
    expect(ride.getDriverId()).toBeNull();
    expect(ride).toHaveProperty('fromLat', 1);
    expect(ride).toHaveProperty('fromLong', 1);
    expect(ride).toHaveProperty('toLat', 1);
    expect(ride).toHaveProperty('toLong', 1);
    expect(ride).toHaveProperty('fare', 0);
    expect(ride.getDistance()).toEqual(0);
    expect(ride.getStatus()).toEqual('requested');
    expect(ride).toHaveProperty('date', date);
  });

  test('Should not find ride', () => {
    const rideID = '61b281b9-e7ec-42ab-8480-4c6f42163a5d';
    expect(() => getRide.execute(rideID)).rejects.toThrow('Ride not found');
  });
});
