import * as winston from 'winston';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const logsPath = join(process.cwd(), 'logs');
if (!existsSync(logsPath)) {
  mkdirSync(logsPath);
}

const logFile = join(logsPath, 'error.log');
export const errorLogger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({ filename: logFile }),
    new winston.transports.Console(),
  ],
});
