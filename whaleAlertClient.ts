import { WhaleAlert } from "./whaleAlert.ts";

export default async function getLatestTransactions(
  apiKey: string,
  minValue: number,
  start: number,
  logger: any,
): Promise<WhaleAlert | undefined> {
  const endpoint =
    `https://api.whale-alert.io/v1/transactions?api_key=${apiKey}&min_value=${minValue}&start=${start}`;

  const json = fetch(endpoint);

  return json.then((response) => {
    return response.json();
  }).catch((error) => {
    logger.error(error);
    return undefined;
  });
}
