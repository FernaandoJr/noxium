import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, Locale, User, GuildMember } from "discord.js"
import { Command } from "../../commandHandler"

const kick: Command = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a user from the server.")
    .addUserOption((option) => option.setName("member").setDescription("The member to kick").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("The reason for the kick").setRequired(true)),
  async execute(interaction) {
    const { options } = interaction
    const member = options.getMember("member") as GuildMember
    const reason = options.getString("reason") as string
    const user = options.getUser("member") as User
    try {
      if (interaction.guild) {
        await member.kick(reason)
      } else {
        throw new Error("This command can only be used in a server.")
      }

      await interaction.reply({
        content: `User ${user.tag} kicked successfully.`,
      })
    } catch (error) {
      console.error("Error kicking user:", error)
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      })
    }
  },
}

export default kick
