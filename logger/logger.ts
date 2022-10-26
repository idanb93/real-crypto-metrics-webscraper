import { createLogger, transports, format } from "winston"

export const logger = createLogger({
  transports: [new transports.Console()],

  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      ({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`
    )
  ),
})
