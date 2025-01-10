import Ride from '../../../core/domain/entities/Ride';
import RideData from '../../../core/useCases/repositories/RideData';
import { db } from './db';

export default class RideDAODatabase implements RideData {
  async findRideById(rideId: string): Promise<Ride|null> {
    const [rideData] = await db.query("select * from ccca.ride where ride_id = $1", [rideId]);
    
    if (!rideData) return null;

    return new Ride(
      rideData.ride_id,
      rideData.passenger_id,
      rideData.driver_id,
      rideData.status,
      rideData.fare,
      rideData.distance,
      rideData.from_lat,
      rideData.fromLong,
      rideData.toLat,
      rideData.toLong,
      rideData.date
    );
  }

  async hasActiveRideByPassagerId(passagerId: string): Promise<boolean> {
    const [rideData] = await db.query("select 1 from ccca.ride where not exists (select 1 from ccca.ride where passenger_id = $1 and status != 'completed')", [passagerId]);
    return !!rideData;
  }

  async hasActiveRideByDriverId(driverId: string): Promise<boolean> {
    const [rideData] = await db.query("select 1 from ccca.ride where not exists (select 1 from ccca.ride where driver_id = $1 and status not in ('accepted', 'in_progress'))", [driverId]);
    return !!rideData;

  }

  async saveRide(ride: Ride): Promise<void> {
    await db.query(
      "insert into ccca.ride (ride_id, passenger_id, driver_id, status, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [ride.rideId, ride.passengerId, ride.getDriverId(), ride.getStatus(), ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date]
    );
  }

  async updateRide(ride: Ride): Promise<void> {
    await db.query(
      "update ccca.ride set passenger_id = $1, driver_id = $2, status = $3, from_lat = $4, from_long = $5, to_lat = $6, to_long = $7, date = $8 where ride_id = $9", [ride.passengerId, ride.getDriverId(), ride.getStatus(), ride.fromLat, ride.fromLong, ride.toLat, ride.toLong, ride.date, ride.rideId]
    );
  }
}