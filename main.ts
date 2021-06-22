import BotConfiguration, { loadConfiguration } from "./botConfiguration.ts";
import { Client } from "./deps.ts";
import getLatestTransactions from "./whaleAlertClient.ts";
import { WhaleAlert } from "./whaleAlert.ts";
import { getLogger } from "./logger.ts";

let connected = false;
const configuration: BotConfiguration = await loadConfiguration();
const logger: any = await getLogger();
const formatter = new Intl.NumberFormat("en-US");
const client = new Client({
  nick: configuration.botNick,
  channels: [configuration.channel],
});

async function connect() {
  if (!connected) {
    await client.connect(configuration.ircServer, configuration.ircPort);
  }
}

client.on("join", async (_) => {
  if (configuration.enableNickServ) {
    await client.privmsg(
      "NickServ",
      `IDENTIFY ${configuration.botNick} ${configuration.nickServPassword}`,
    );
    logger.debug(
      `Sent IDENTIFY ${configuration.botNick} <REDACTED>`,
    );
  }
});

client.on("connected", (msg) => {
  logger.info(`$Connected! Info: ${msg}`);
  connected = true;
});

client.on("disconnected", async (msg) => {
  logger.error(`$Disconnected! Info: ${msg}`);
  connected = false;
  await connect();
});

client.on("error", (error) => {
  logger.error(`Error: ${JSON.stringify(error)}`);
});

client.on("raw", (msg) => {
  logger.debug(`Raw: ${JSON.stringify(msg)}`);
});

client.on("privmsg", (msg) => {
  const { origin, target, text } = msg;
  logger.debug(`${origin.nick} on ${target} says ${text}`);
});

await connect();

let start = Math.floor(Date.now() / 1000);
let lastMessageDate = Date.now();
const interval = configuration.pollInterval / 1000;
setInterval(async () => {
  const alerts: WhaleAlert | undefined = await getLatestTransactions(
    configuration.whaleAlertApiKey,
    configuration.minValue,
    start,
    logger,
  );
  if (!alerts) {
    return;
  }
  logger.debug(
    `Retrieved latest transactions starting from ${start}. Current date (ticks): ${
      Math.floor(Date.now() / 1000)
    }`,
  );
  logger.debug(`Transactions: ${JSON.stringify(alerts)}`);
  if (
    alerts.result === "success" && alerts.transactions &&
    alerts.transactions.length
  ) {
    alerts.transactions.forEach(async (transaction) => {
      const source = transaction.from.owner_type.toLowerCase() === "unknown"
        ? "Unknown wallet"
        : (transaction.from.owner ?? transaction.from.owner_type);
      const target = transaction.to.owner_type.toLowerCase() === "unknown"
        ? "Unknown wallet"
        : (transaction.to.owner ?? transaction.to.owner_type);
      if ((Date.now() - lastMessageDate) <= configuration.rateLimit) {
        await new Promise((r) => setTimeout(r, configuration.rateLimit));
      }
      lastMessageDate = Date.now();
      client.privmsg(
        configuration.channel,
        `${
          formatter.format(transaction.amount)
        } \u0002#${transaction.symbol.toUpperCase()} (${
          formatter.format(transaction.amount_usd)
        } USD)\u000F transferred from ${source} to ${target}`,
      );
    });
  }

  start += interval;
}, configuration.pollInterval);
