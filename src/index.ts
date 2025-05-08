import { Client, Collection, GatewayIntentBits } from "discord.js"
import { config } from "./config"
import { Command } from "./commandHandler"
import { readdirSync } from "fs"
import path from "path"
import mongoose from "mongoose"
import { registerCommands } from "./register"

interface ExtendedClient extends Client {
	commands: Collection<string, Command>
}

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.MessageContent,
	],
}) as ExtendedClient

client.commands = new Collection<string, Command>()

const commandFolder = readdirSync(path.join(__dirname, "commands"))

for (const folder of commandFolder) {
	const commandFiles = readdirSync(
		path.join(__dirname, "commands", folder)
	).filter((file) => file.endsWith(".ts"))

	for (const file of commandFiles) {
		const command = require(path.join(
			__dirname,
			"commands",
			folder,
			file
		)).default

		console.log(`[INFO] Loading command ${command.data.name} from ${file}`)

		if (!command.data.name) {
			console.log(
				`[WARNING] Command file ${file} is missing name property`
			)
			continue
		}

		client.commands.set(command.data.name, command)
	}
}

client.once("ready", async () => {
	// try {
	// 	await mongoose.connect(config.MONGODB_URI)
	// 	console.log("[INFO] Connected to MongoDB")
	// } catch (error) {
	// 	console.error("[ERROR] Failed to connect to MongoDB:", error)
	// 	return
	// }

	console.log(`${client.user?.tag} is ready!`)
	await registerCommands()

	client.on("interactionCreate", async (interaction) => {
		if (!interaction.isChatInputCommand()) return

		const command = client.commands.get(interaction.commandName)
		if (!command) return

		try {
			console.log(interaction)
			await command.execute(interaction)
		} catch (error) {
			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			})
			console.error(
				`[ERROR] Failed to execute command ${interaction.commandName}:`,
				error
			)
		}
	})
})

client.login(config.DISCORD_TOKEN)
