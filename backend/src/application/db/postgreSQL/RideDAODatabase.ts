import RideData from '../../../core/useCases/repositories/RideData';
import { db } from './db';

export default class RideDAODatabase implements RideData {
  async findRideByID(rideID: string): Promise<any> {
    const [ ride ] = await db.query("select * from ccca.ride where ride_id = $1", [rideID]);
    
    return {
      rideId: ride.ride_id,
      passengerId: ride.passenger_id,
      driverId: ride.driver_id,
      status: ride.status,
      fare: ride.fare,
      distance: ride.distance,
      fromLat: ride.from_lat,
      fromLong: ride.fromLong,
      toLat: ride.toLat,
      toLong: ride.toLong,
      date: ride.date
    };
  }

  async findRideInProgressByPassagerId(passagerId: string): Promise<any> {
    return db.query("select 1 from ccca.ride where not exists (select 1 from ccca.ride where passenger_id = $1 and status != 'completed')", [passagerId])
  }

  async createRide(ride: any): Promise<void> {
    await db.query(
      "insert into ccca.ride (ride_id, passenger_id, driver_id, status, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [ride.id, ride.passengerId, ride.driverId, ride.status, ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]
    );
  }
}