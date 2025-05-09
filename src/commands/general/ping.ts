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
const ping: Command = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
  async execute(interaction) {
    const delay = Math.round(Math.abs(Date.now() - interaction.createdTimestamp) / 100)

    const ping = interaction.client.ws.ping

    const days = Math.floor(interaction.client.uptime / 86400000)
    const hours = Math.floor(interaction.client.uptime / 3600000) % 24 // 1 Day = 24 Hours
    const minutes = Math.floor(interaction.client.uptime / 60000) % 60 // 1 Hour = 60 Minutes
    const seconds = Math.floor(interaction.client.uptime / 1000) % 60 // I Minute = 60 Seconds

    // Check if the locale is pt-BR or en-US and set the correct locale
    if (interaction.locale === "pt-BR") {
      correctLocale = {
        field1_name: "🤖 Latência do bot:",
        field1_value: `${delay}ms`,

        field2_name: "❤️ Latência da API:",
        field2_value: `${ping}ms`,

        field3_name: "Tempo Ativo:",
        field3_value: `Eu estou ativo à ${days > 0 ? `${days} ${days === 1 ? "Dia" : "Dias"} ` : ""}${hours > 0 ? `${hours} ${hours === 1 ? "Hora" : "Horas"} ` : ""}	${minutes > 0 ? `${minutes} ${minutes === 1 ? "Minuto" : "Minutos"} ` : ""} ${seconds > 0 ? `${seconds} ${seconds === 1 ? "Segundo" : "Segundos"} ` : ""}`.trim(),
      }
    } else {
      correctLocale = {
        field1_name: "🤖 Bot latency:",
        field1_value: `${delay}ms`,

        field2_name: "❤️ API latency:",
        field2_value: `${ping}ms`,

        field3_name: "Uptime:",
        field3_value: `My uptime is ${days > 0 ? `${days} ${days === 1 ? "Day" : "Days"} ` : ""} ${hours > 0 ? `${hours} ${hours === 1 ? "Hour" : "Hours"} ` : ""} ${minutes > 0 ? `${minutes} ${minutes === 1 ? "Minute" : "Minutes"} ` : ""} ${seconds > 0 ? `${seconds} ${seconds === 1 ? "Second" : "Seconds"} ` : ""}`.trim(),
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .addFields(
        {
          name: correctLocale.field1_name,
          value: correctLocale.field1_value,
          inline: false,
        },
        {
          name: correctLocale.field2_name,
          value: correctLocale.field2_value,
          inline: false,
        },
        {
          name: correctLocale.field3_name,
          value: correctLocale.field3_value,
          inline: false,
        }
      )
      .setColor("#5b65ec")
      .setFooter({
        text: "Noxium",
        iconURL: "https://cdn.discordapp.com/avatars/1369753547218092082/c9d167b181be734321965258418f56f8.webp",
      })
      .setTimestamp()
    await interaction.reply({ embeds: [embed] })
  },
}

export default ping
