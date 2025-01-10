import BusinessError from '../domain/entities/errors/BusinessError';
import Position from '../domain/entities/Position';
import Ride from '../domain/entities/Ride';
import DistanceCalculator from '../domain/service/DistanceCalculator';
import GetRide from './GetRide';
import PositionData from './repositories/PositionData';
import RideData from './repositories/RideData';

export default class UpdatePosition {
  constructor(
    readonly rideData: RideData,
    readonly positionData: PositionData
  ) {}

  async execute(input: Input) {
    const ride = await GetRide.get(this.rideData, input.rideId);
    if (ride.getStatus() !== 'in_progress') throw new BusinessError('Ride invalid status');

    const position = Position.create(input.rideId, input.lat, input.long);
    const previousPosition = await this.positionData.lastPositionByRideId(input.rideId);
    await this.positionData.savePosition(position);

    if (previousPosition) {
      const positions = [previousPosition, position]; 
      await this.updateDistance(ride, positions);
    }
  }

  private updateDistance(ride: Ride, positions: Position[]) {
    const distance = DistanceCalculator.calculateDistanceBetweenPositions(positions);
    ride.increaseDistance(distance);
    this.rideData.updateRide(ride);
  }
}

type Input = {
  rideId: string,
  lat: number,
  long: number
};