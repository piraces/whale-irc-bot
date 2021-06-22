export default interface BotConfiguration {
  ircServer: string;
  ircPort: number;
  botNick: string;
  channel: string;
  enableNickServ: boolean;
  nickServPassword: string | undefined;
  whaleAlertApiKey: string;
  minValue: number;
  pollInterval: number;
  rateLimit: number;
}

export async function loadConfiguration(
  configFile: string = "bot.config.json",
): Promise<BotConfiguration> {
  const decoder = new TextDecoder("utf-8");
  const config = await Deno.readFile(configFile);
  return JSON.parse(decoder.decode(config));
}
