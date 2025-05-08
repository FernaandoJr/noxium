export default function logMessage(
	message: string,
	type: "INFO" | "SUCCESS" | "ERROR" | "WARNING" | "DEBUG"
) {
	const now = new Date()
	const timestamp = now
		.toISOString()
		.replace("T", " ")
		.split(".")[0]
		.replace(/-/g, "/") // Format: YYYY/MM/DD hh:mm:ss

	const logTypes = {
		INFO: "\x1b[36m[INFO]\x1b[0m", // Cyan
		SUCCESS: "\x1b[32m[SUCCESS]\x1b[0m", // Green
		ERROR: "\x1b[31m[ERROR]\x1b[0m", // Red
		WARNING: "\x1b[33m[WARNING]\x1b[0m", // Yellow
		DEBUG: "\x1b[34m[DEBUG]\x1b[0m", // Blue
	}
	const logType = logTypes[type] || logTypes.INFO
	console.log(`${logType} [${timestamp}] ${message}`)
}
