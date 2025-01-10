import Position from '../../domain/entities/Position';

export default interface PositionData {
  savePosition(position: Position): Promise<void>;
  lastPositionByRideId(rideId: string): Promise<Position|null>;
}