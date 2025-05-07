import { Client } from "discord.js"
import { config } from "./config"

const client = new Client({
	intents: ["Guilds", "GuildMessages", "DirectMessages"],
})

client.once("ready", (c) => {
	console.log("Discord bot is ready! 🤖")
	console.log(`Logged in as ${c.user.tag}`)
})

client.login(config.DISCORD_TOKEN)
