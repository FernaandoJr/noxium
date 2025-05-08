import { Guild, REST, Routes } from "discord.js"
import { config } from "./config"
import logMessage from "./utils/logMessage"
import { readdirSync } from "fs"
import path from "path"
import { Command } from "./commandHandler"

// Dynamically load all command files
const commandFiles: Map<string, Command> = new Map()
const commandFolders = readdirSync(path.join(__dirname, "commands"))

for (const folder of commandFolders) {
	const files = readdirSync(path.join(__dirname, "commands", folder)).filter(
		(file) => file.endsWith(".ts") || file.endsWith(".js")
	)

	for (const file of files) {
		const command = require(path.join(
			__dirname,
			"commands",
			folder,
			file
		)).default
		if (command && "data" in command && "execute" in command) {
			// Use the command name as the key in the Map
			commandFiles.set(command.data.toJSON().name, command)
		} else {
			logMessage(
				`Command file ${file} is missing data or execute property`,
				"WARNING"
			)
		}
	}
}

// Array to store serialized commands
const commands = Array.from(commandFiles.values()).map((command) =>
	command.data.toJSON()
)

// Create a new REST client for interacting with Discord's API
const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN)

// Function to register commands with Discord
export const registerCommands = async (guildId?: string) => {
	try {
		logMessage(
			`Started refreshing ${commands.length} application (/) commands.`,
			"INFO"
		)

		// Register commands with Discord's API
		const data: any = await rest.put(
			Routes.applicationGuildCommands(
				config.CLIENT_ID,
				guildId || config.GUILD_ID // Use the provided guild ID or fallback to the test server ID
			),
			{ body: commands } // Send the serialized commands
		)

		logMessage(
			`Successfully reloaded ${data.length} application (/) commands.`,
			"INFO"
		)
	} catch (error) {
		logMessage(`Failed to register commands: ${error}`, "ERROR") // Log any errors that occur
	}
}

// Export the commandFiles Map for later use
export { commandFiles }
