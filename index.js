const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp"); // YouTube support

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const distube = new DisTube(client, {
  plugins: [
    new SpotifyPlugin(),
    new SoundCloudPlugin(),
    new YtDlpPlugin(), // Improved YouTube support
  ],
  emitNewSongOnly: true,
});

client.on("ready", () => {
  console.log(`𝙢𝙚𝙧𝙘𝙪𝙧𝙮𝙮 ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (!message.guild || message.author.bot) return;

  const args = message.content.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "+kk") {
    if (!message.member.voice.channel)
      return message.reply("🚫 **You must be in a voice channel to play music!**");

    try {
      const query = args.join(" ");
      if (!query) return message.reply("🎶 **Please enter a song name or YouTube link!**");

      await distube.play(message.member.voice.channel, query, { message });

      const embed = new EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("🎧 Now Playing")
        .setDescription(`🔗 **Playing:** [${query}](${query})`)
        .setFooter({ text: "🎵 Enjoy your music!" });

      message.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.reply("❌ **An error occurred while playing the song!**");
    }
  }

  if (command === "+att") {
    distube.stop(message);

    const stopEmbed = new EmbedBuilder()
      .setColor("#ff0000")
      .setTitle("⏹ Playback Stopped")
      .setDescription("🎵 **Music playback has been stopped!**")
      .setFooter({ text: "🎧 Thanks for using the bot!" });

    message.reply({ embeds: [stopEmbed] });
  }

  if (command === "+doz") {
    const queue = distube.getQueue(message);

    if (!queue || queue.songs.length <= 1) {
      return message.reply("🔄 **No next song in the queue. The current song will continue playing!**");
    }

    distube.skip(message);

    const skipEmbed = new EmbedBuilder()
      .setColor("#00ff00")
      .setTitle("⏩ Song Skipped")
      .setDescription("🎶 **Skipped to the next track!**")
      .setFooter({ text: "🎵 Enjoy your next song!" });

    message.reply({ embeds: [skipEmbed] });
  }
});


client.login("tokon");




