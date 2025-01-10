import crypto from 'crypto';
import BusinessError from './errors/BusinessError';

export default class Ride {
  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private driverId: string | null,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    readonly fare: number,
    private distance: number,
    private status: string,
    readonly date: Date
  ) {}

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const rideId = crypto.randomUUID();
    const fare = 0;
    const distance = 0;
    const status = 'requested';
    const date = new Date();
    return new Ride(rideId, passengerId, null, fromLat, fromLong, toLat, toLong, fare, distance, status, date);
  }

  accept(driverId: string) {
    if (this.status !== 'requested') throw new BusinessError('Invalid status');
    this.driverId = driverId;
    this.status = 'accepted';
  }

  startRide() {
    if (this.status !== 'accepted') throw new BusinessError('Ride status is invalid');
    this.status = 'in_progress';
  }

  increaseDistance(distance: number) {
    this.distance += distance;
  }

  getDriverId() {
    return this.driverId;
  }

  getStatus() {
    return this.status;
  } 

  getDistance() {
    return this.distance;
  }
}