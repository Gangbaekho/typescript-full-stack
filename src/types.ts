import { Request, Response } from "express";
import { Redis } from "ioredis";
export type MyContext = {
  // em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: { [key: string]: any } };
  res: Response;
  redis: Redis;
};
