import crypto from 'node:crypto';
import Coord from '../vo/Coord';


export default class Position {
  private coord: Coord;
  
  constructor(
    readonly positionId: string,
    readonly rideId: string,
    lat: number,
    long: number,
    readonly date: Date
  ) {
    this.coord = new Coord(lat, long);
  }

  static create(rideId: string, lat: number, long: number) {
    const positionId = crypto.randomUUID();
    const date = new Date();
    return new Position(positionId, rideId, lat, long, date);
  }

  getCoord() {
    return this.coord;
  }
}