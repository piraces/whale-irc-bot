# 🐋 Whale IRC Bot
IRC Bot that sends alerts to the channel #crypto-whale-alerts in irc.libera.chat from whale-alert.io about large and unusual transactions in crypto exchanges.

# Features

- 💬 Most IRC servers support.
- 👥 NickServ identification.
- 👷‍♂️ Completly configurable.
- 🐳 Ready to deploy to Docker.


# How does it work

This bot makes requests to the [Whale Alert](https://whale-alert.io) API ([docs here](https://docs.whale-alert.io/#introduction)), in order to retrieve the latest transactions in a predefined interval which reaches or surpass the limit defined in the bot configuration. When a transaction meets this requirements, an alert is sent to the configured IRC channel in the following format:

```text
<NumberOfTokens> #<CryptoTicket> (<Price in USD>) transferred from #<Source> to #<Destination>.
```

For example:
```text
10,000 #ETH (22,366,904 USD) transferred from #Coinbase to #Binance
```

In order to achieve this, **the bot needs the following**:

- A [Whale Alert API token](https://whale-alert.io/signup).
- An IRC Server and port to connect to.
- A nick for the bot.
- A channel to connect to.
- (Optional) A NickServ password in order to identify the bot in the server.


# Configuring the bot

The repository contains an example configuration file named `bot.config.sample.json` which contains basic sample configuration for the bot.

In order to bootstrap our bot, we need to copy that file to a one named `bot.config.json`.

Then we can proceed to configure it. Take a look to the table below to see all the configuration values explained:

| Key              | Type    | Default value         | Details                                                                                                                          |
|------------------|---------|-----------------------|----------------------------------------------------------------------------------------------------------------------------------|
| ircServer        | string  | irc.libera.chat       | IRC server hostname to connect to                                                                                                |
| ircPort          | number  | 6667                  | IRC server port (usually 6667)                                                                                                   |
| botNick          | string  | whaleCryptoBot        | The nick for your bot to take                                                                                                    |
| channel          | string  | ##crypto-whale-alerts | The channel where the bot will post messages to                                                                                  |
| enableNickServ   | boolean | false                 | Enable NickServ identification or not                                                                                            |
| nickServPassword | string  | nickservpass          | If `enableNickServ` is true, the pass to use when identificating                                                                 |
| whaleAlertApiKey | string  | apiKey                | The API Key obtained from Whale-alert.io                                                                                         |
| minValue         | number  | 5000000               | Minimum value in USD to consider as an alert. All transactions equal or greater than this value will be reported to the channel. |
| pollInterval     | number  | 60000                 | Number of milliseconds to wait between API calls (default value is the recommended for free accounts)                            |


# Running the bot

Make sure to have [Deno]() installed or use the Docker image instead.

**Using your shell and Deno:**

```shell
deno run --allow-net --allow-read --allow-write main.ts
```

**Using docker:**

```shell
docker build -t whale-irc-bot .
docker run -d whale-irc-bot
```

# Dependencies

- [deno.land/x/irc@v0.4.1](https://deno.land/x/irc@v0.4.1)
- [deno.land/std@0.99.0/log](https://deno.land/std@0.99.0/log)
