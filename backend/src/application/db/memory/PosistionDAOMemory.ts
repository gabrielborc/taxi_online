import Position from '../../../core/domain/entities/Position';
import PositionData from '../../../core/useCases/repositories/PositionData';

export default class PositionDAOMemory implements PositionData {
  private data: Position[] = [];

  async savePosition(position: Position): Promise<void> {
    this.data.push(position);
  }

  async lastPositionByRideId(rideId: string): Promise<Position> {
    const positions = this.data.filter((position) => position.rideId === rideId);
    const lastIndex = positions.length - 1;
    return  positions[lastIndex];
  }
}