import { Request, Response } from 'express';
import RideDAO from '../db/postgreSQL/RideDAODatabase';
import AccountDAO from '../db/postgreSQL/AccountDAODatabase';
import requestRide from '../../core/useCases/requestRide';
import getRide from '../../core/useCases/getRide';

const accountDAO = new AccountDAO();
const rideDAO = new RideDAO();

export async function getRideRequest(req: Request, res: Response) {
  const { rideID } = req.params;
  const ride = await getRide(rideID, rideDAO);
  return res.json(ride);
}

export async function createRideRequest(req: Request, res: Response) {
  const input = req.body;
  const ride = await requestRide(input, accountDAO, rideDAO);
  return res.json(ride);
}