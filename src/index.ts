// Import necessary modules and classes
import { Client, Collection, GatewayIntentBits } from "discord.js"
import { config } from "./config"
import { Command } from "./commandHandler"
import { readdirSync } from "fs"
import path from "path"
import mongoose from "mongoose"
import { registerCommands } from "./register"
import logMessage from "./utils/logMessage"

// Extend the Discord.js Client to include a custom 'commands' property
interface ExtendedClient extends Client {
	commands: Collection<string, Command> // A collection to store commands by their name
}

// Create a new Discord client with specific intents
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds, // Enables receiving events related to guilds
		GatewayIntentBits.GuildMessages, // Enables receiving events related to guild messages
		GatewayIntentBits.GuildMembers, // Enables receiving events related to guild members
		GatewayIntentBits.MessageContent, // Enables access to message content
	],
}) as ExtendedClient

// Initialize the commands collection
client.commands = new Collection<string, Command>()

// Read the 'commands' folder to dynamically load command files
const commandFolder = readdirSync(path.join(__dirname, "commands")) // Get all folders in the 'commands' directory

for (const folder of commandFolder) {
	// Read all command files in each folder
	const commandFiles = readdirSync(
		path.join(__dirname, "commands", folder)
	).filter((file) => file.endsWith(".ts") || file.endsWith(".js")) // Filter for .ts or .js files

	for (const file of commandFiles) {
		// Dynamically import each command file
		const command = require(path.join(
			__dirname,
			"commands",
			folder,
			file
		)).default
		logMessage(
			`Loading command ${command.data.name} from ${file}`,
			"SUCCESS"
		)

		if (!command.data.name) {
			logMessage(
				`Command file ${file} is missing name property`,
				"WARNING"
			)
			continue
		}

		// Add the command to the commands collection
		client.commands.set(command.data.name, command)
	}
}

client.once("ready", async () => {
	// Uncomment the following block to connect to MongoDB if you want
	// try {
	// 	await mongoose.connect(config.MONGODB_URI) // Connect to MongoDB
	// logMessage("Connected to MongoDB", "SUCCESS") // Log successful connection
	// } catch (error) {
	// 	console.error("[ERROR] Failed to connect to MongoDB:", error) // Log connection error
	// 	return // Exit if the connection fails
	// }

	logMessage(`Bot ${client.user?.tag} is ready`, "SUCCESS") // Log that the bot is ready
	logMessage("Bot is online", "SUCCESS") // Log that the bot is online

	// Register commands
	await registerCommands()

	// Event listener for interactions (e.g., slash commands)
	client.on("interactionCreate", async (interaction) => {
		if (!interaction.isChatInputCommand()) return // Ignore non-chat input commands

		const command = client.commands.get(interaction.commandName) // Get the command from the collection
		if (!command) return // Ignore if the command doesn't exist

		try {
			// Execute the command
			await command.execute(interaction)
		} catch (error) {
			// Reply with an error message if the command fails
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true, // Make the reply visible only to the user
			})
			logMessage(
				`[ERROR] Error executing command ${interaction.commandName}: ${error}`,
				"ERROR"
			)
		}
	})
})

// Log in to Discord using the bot token from the config
client.login(config.DISCORD_TOKEN)
