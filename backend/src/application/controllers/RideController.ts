import { Request, Response } from 'express';
import { HttpServer } from '../http/Server';
import GetRide from '../../core/useCases/GetRide';
import RequestRide from '../../core/useCases/RequestRide';

export default class RideController {
  constructor(
    readonly httpServer: HttpServer,
    readonly getRide: GetRide,
    readonly requestRide: RequestRide
  ) {
    httpServer.register('get', '/rides/:rideId', async (req: Request, res: Response) => {
      const { rideId } = req.params;
      const ride = await getRide.execute(rideId);
      return res.json(ride);
    });

    httpServer.register('post', '/rides', async (req: Request, res: Response) => {
      const input = req.body;
      const ride = await requestRide.execute(input);
      return res.json(ride);
    });
  }
}