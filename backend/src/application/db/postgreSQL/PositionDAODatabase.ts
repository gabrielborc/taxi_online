import Position from '../../../core/domain/entities/Position';
import PositionData from '../../../core/useCases/repositories/PositionData';
import { db } from './db';

export default class PositionDAODatabase implements PositionData {
  async savePosition(position: Position): Promise<void> {
    await db.query(
      "insert into ccc.position (position_id, ride_id, lat, long, date)",
      [position.positionId, position.rideId, position.getCoord().getLat(), position.getCoord().getLong(), position.date]
    );
  }

  async lastPositionByRideId(rideId: string): Promise<Position|null> {
    const [positionData] = await db.query("select * from ccca.position where ride_id = $1 order by date desc limit 1", [rideId]);

    if (!positionData) return null;

    return new Position(
      positionData.position_id,
      positionData.ride_id,
      positionData.lat,
      positionData.long,
      positionData.date
    );
  }

}