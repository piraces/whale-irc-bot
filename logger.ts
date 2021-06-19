import { log } from "./deps.ts";

async function configureLogger() {
  return await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("DEBUG", {
        formatter: "{datetime} {levelName} {msg}",
      }),
      file: new log.handlers.RotatingFileHandler("INFO", {
        filename: "./bot.log",
        maxBytes: 1000000,
        maxBackupCount: 5,
        formatter: (rec) =>
          JSON.stringify({
            region: rec.loggerName,
            ts: rec.datetime,
            level: rec.levelName,
            data: rec.msg,
          }),
      }),
    },

    loggers: {
      default: {
        level: "DEBUG",
        handlers: ["console"],
      },
      client: {
        level: "INFO",
        handlers: ["file"],
      },
    },
  });
}

export async function getLogger(logger: string = "client") {
  await configureLogger();
  return log.getLogger(logger);
}
