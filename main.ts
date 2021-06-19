import { Client } from "./deps.ts";

let joined = false;

const nickServPass = "3R5pcP&Pv6v^v4";
const client = new Client({
    nick: "whaleCryptoBot",
    channels: ["##crypto-whale-alerts"],
});

client.on("join", (msg) => {
    if (msg.channel === "##crypto-whale-alerts") {
        joined = true;
        client.privmsg("NickServ", `IDENTIFY whaleCryptoBot ${nickServPass}`);
    }
});

client.on("privmsg:private", (msg) => {
    const { origin, text } = msg;
    console.log(`${origin.nick} says to you: ${text}`);
});

await client.connect("irc.libera.chat", 6667);