import { REST, Routes } from "discord.js"
import { config } from "./config"
import PingCommand from "./commands/general/ping"

interface Command {
	data: {
		toJSON: () => any
	}
	execute: () => void
}

const commandFiles = [PingCommand]

const commands: any[] = []

for (const file of commandFiles) {
	if ("data" in file && "execute" in file) {
		commands.push(file.data.toJSON())
	} else {
		console.log(
			"[WARNING] Command file is missing data or execute property"
		)
	}
}
const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN)

export const registerCommands = async () => {
	try {
		console.log(
			`[INFO] Started refreshing ${commands.length} application (/) commands.`
		)

		const data: any = await rest.put(
			Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
			{ body: commands }
		)

		console.log(
			`[INFO] Successfully reloaded ${data.length} application (/) commands.`
		)
	} catch (error) {
		console.error("[ERROR] Failed to register commands:", error)
	}
}
