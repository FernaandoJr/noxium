import dotenv from "dotenv"
dotenv.config()
const { DISCORD_TOKEN, DISCORD_CLIENT_ID, GUILD_ID, MONGODB_URI } = process.env

// Check if the environment variables are set
if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID || !GUILD_ID) {
	throw new Error("Missing environment variables")
}

export const config = {
	CLIENT_ID: process.env.DISCORD_CLIENT_ID as string, // Fix here
	DISCORD_TOKEN: process.env.DISCORD_TOKEN as string,
	GUILD_ID: process.env.GUILD_ID as string,
	MONGODB_URI: process.env.MONGODB_URI as string,
}
