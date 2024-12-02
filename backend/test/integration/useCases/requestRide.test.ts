import RideDAOMemory from '../../../src/application/db/memory/RideDAOMemory';
import AccountDAOMemory from '../../../src/application/db/memory/AccountDAOMemory';
import requestRide from '../../../src/core/useCases/requestRide';

let accountDAO: AccountDAOMemory;
let rideDAO: RideDAOMemory;

beforeEach(async () => {
  accountDAO = new AccountDAOMemory();
  rideDAO = new RideDAOMemory();

  const accountDatas = {
    id: '63c7d92a-aa62-4e49-acf7-459c6b2ae430',
    name: 'Fulano Silva',
    email: 'fulano@gmail.com',
    cpf: '959.600.920-69',
    carPlate: null,
    password: '123',
    isPassenger: true,
    isDriver: false
  };

  await accountDAO.createAccount(accountDatas);
  await accountDAO.createAccount({
    ...accountDatas,
    id: '63c7d92a-aa62-4e49-acf7-459c6b2ae432',
    email: 'fulano2@gmail.com',
    isPassenger: false,
    isDriver: true
  });
});

describe('Request ride', () => {
  test('should fail request when passenger account not found', () => {
    const inputRide = {
      passengerId: '63c7d92a-aa62-4e49-acf7-459c6b2ae431',
      fromLat: 1,
      fromLong: 1,
      toLat: 1,
      toLong: 1
    };

    expect(() => requestRide(inputRide, accountDAO, rideDAO)).rejects.toThrow('Account not found');
  });
  
  test('should fail request when account is driver', () => {
    const inputRide = {
      passengerId: '63c7d92a-aa62-4e49-acf7-459c6b2ae432',
      fromLat: 1,
      fromLong: 1,
      toLat: 1,
      toLong: 1
    };

    expect(() => requestRide(inputRide, accountDAO, rideDAO)).rejects.toThrow('Account is not passeger');
  });

  test('should fail request when this ride in progressing', async () => {
    const inputRide = {
      passengerId: '63c7d92a-aa62-4e49-acf7-459c6b2ae430',
      fromLat: 1,
      fromLong: 1,
      toLat: 1,
      toLong: 1
    };
    
    await requestRide(inputRide, accountDAO, rideDAO);
    expect(() =>  requestRide(inputRide, accountDAO, rideDAO)).rejects.toThrow('Duplicate ride');
  });

  test('should create ride', async () => {
    const inputRide = {
      passengerId: '63c7d92a-aa62-4e49-acf7-459c6b2ae430',
      fromLat: 1,
      fromLong: 1,
      toLat: 1,
      toLong: 1
    };
    
    const result = await requestRide(inputRide, accountDAO, rideDAO);

    expect(result).toHaveProperty('rideId');
  });
});