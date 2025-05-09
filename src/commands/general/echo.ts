import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Locale } from "discord.js"
import { Command } from "../../commandHandler"

let correctLocale = {
  field1_name: "",
  field1_value: "",
  field2_name: "",
  field2_value: "",
  field3_name: "",
  field3_value: "",
}
const echo: Command = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Replies the user's message. (Only the user can see the message)")
    .addStringOption((option) => option.setName("message").setDescription("The message to echo").setRequired(true)),
  async execute(interaction) {
    const { options } = interaction
    await interaction.reply({
      content: options.getString("message") || "No message provided",
      ephemeral: true,
    })
  },
}

export default echo
