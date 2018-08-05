const { Client, Util } = require('discord.js');
const Discord = require('discord.js');
const client = new Client();
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");

const queue = new Map();

var prefix = "%";
var adminID = "301073031801995264";

const commands = {
	'help': (msg) => {
		let tosend = ["=== MUSIC HELP ===", '```', prefix + 'play (song name) : "Plays a song."',	prefix + 'np : "Shows the song which is currently playing."', prefix + 'queue : "Shows the current queue, up to 15 songs shown."', prefix + 'pause : "Pauses the current song."', prefix + 'resume : "resumes the music"', prefix + 'skip : "skips the playing song"', prefix + 'stop : "Stops the current song."',	prefix + 'volume (50) : "Sets the volume to 50%"', '```', "=== MODERATION HELP ===", '```', prefix + "clear (number of messages) : Prunes/purges/clears the chat", prefix + "broadcast (message) : Broadcasts a message to all the server members.", prefix + "kick (member) : Kicks a member from the server.", '```'];
		msg.channel.sendMessage(msg.author + " check your DM for the help list! :white_check_mark:");
		msg.author.sendMessage(tosend.join('\n'));
	},
	'reboot': (msg) => {
		if (msg.author.id == adminID) process.exit(); //Requires a node module like Forever to work.
	},
	'clear': (msg) => {
		let limit2 = msg.content.split(' ')[1];
		if (limit2 >= 100) {
			var MessagesToBeCleared = 100;
		} else {
			var MessagesToBeCleared = limit2;
		}
			if(msg.channel.permissionsFor(msg.member).hasPermission("MANAGE_MESSAGES")) {
				if (limit2 == '' || limit2 === undefined) {
					msg.channel.sendMessage(msg.author + " | Enter the number of messages to clear. :x:");
					return;
				} else {
					async function clear() {
						msg.delete();
						const fetched = await msg.channel.fetchMessages({limit: MessagesToBeCleared});
						msg.channel.bulkDelete(fetched);
					}
					clear();
					msg.channel.sendMessage(":white_check_mark: | Cleared " + MessagesToBeCleared + " messages.");
				}
			} else {
				msg.channel.sendMessage(msg.author + " | No permissions! :x:");
			}
		
	},
	'broadcast': (msg) => {
		let message2broadcast = msg.content.split(' ').splice(1).join(' ');
		if (!msg.channel.permissionsFor(msg.member).hasPermission("ADMINISTRATOR")) {
			msg.channel.sendMessage(msg.author + " | No permissions! :x:");
			return;
		} else {
			if (!message2broadcast) {

				msg.channel.sendMessage(msg.author + " | No message entered. :x:");

			} else {
				let tosend2 = ["`Sender:`", msg.author, "`Server:`", msg.guild.name, "`Message:`", message2broadcast];
				msg.channel.guild.members.forEach(user => {
					user.send(tosend2.join('\n'));
				});
				msg.channel.sendMessage(msg.author + " | Successfully broadcasted. :white_check_mark:");
			}
		}
	},
	'uptime': (msg) => {
		let totalSeconds = (client.uptime / 1000);
		let hours = Math.floor(totalSeconds / 3600);
		totalSeconds %= 3600;
		let minutes = Math.floor(totalSeconds / 60);
		let seconds = totalSeconds % 60;
		let uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
		msg.channel.send(uptime);
	},
	'restart': (msg) => {
		msg.channel.send('Restarting bot...');
		client.destroy();
		client.login(process.env.TOKEN);
		msg.channel.send("The bot was restarted successfully.");
	},
	'kick': (msg) => {
		if (!msg.channel.permissionsFor(msg.member).hasPermission("KICK_MEMBERS")) {
			msg.channel.sendMessage(msg.author + " | No permissions! :x:");
			return;
		} else {
			
			const user = msg.mentions.users.first();
			// If we have a user mentioned
			if (user) {
			  // Now we get the member from the user
			  const member = msg.guild.member(user);
			  // If the member is in the guild
			  if (member) {
				/**
				 * Kick the member
				 * Make sure you run this on a member, not a user!
				 * There are big differences between a user and a member
				 */
				member.sendMessage("You was kicked from " + client.guilds.size + " by " + msg.author);
				member.kick('Optional reason that will display in the audit logs').then(() => {
				  // We let the message author know we were able to kick the person
				  msg.channel.sendMessage(user + " was successfully kicked by " + msg.author + " | :white_check_mark:");
				}).catch(err => {
				  // An error happened
				  // This is generally due to the bot not being able to kick the member,
				  // either due to missing permissions or role hierarchy
				  msg.channel.sendMessage(msg.author + ' | I was unable to kick the member | :x:');
				  // Log the error
				  console.error(err);
				});
			  } else {
				// The mentioned user isn't in this guild
				msg.channel.sendMessage('That user isn\'t in this guild! | :x:');
			  }
			// Otherwise, if no user was mentioned
			} else {
			  msg.channel.sendMessage(msg.author + ' | You didn\'t mention the user to kick! | :x:');
			}
			
		}
	},
	'mcserver': (msg) => {
			let serverip = msg.content.split(' ').splice(1).join(' ');
			let serverip_fromfield = serverip.substring(0,serverip.indexOf(":"));
			let serverport_fromfield = serverip.split(':')[1];
			if (!serverip) {

				msg.channel.sendMessage(msg.author + " | No server IP entered. :x:");

			} else {
				
				if (!serverip.includes(":")) {
					serverip_final = serverip;
				} else {
					serverip_final = serverip_fromfield;
				}
				
				if (!serverport_fromfield) {
					var serverport_final = "25565";
				} else {
					var serverport_final = serverport_fromfield;
				}
				
				const embed = new Discord.RichEmbed()
			  .setTitle("Minecraft Server Status")
			  /*
			   * Alternatively, use "#00AE86", [0, 174, 134] or an integer number.
			   */
			  .setColor(0x00AE86)
			  .setThumbnail('https://api.minetools.eu/favicon/' + serverip_final + '/' + serverport_final)
			  .setFooter("Botato Bot by MarioLatifFathy#2793", "http://i.imgur.com/w1vhFSR.png")
			  .setImage("http://status.mclive.eu/BotatoBot/" + serverip_final + "/" + serverport_final + "/banner.png")
			  /*
			   * Takes a Date object, defaults to current date.
			   */
			  .setTimestamp()
			  .addField("Server IP",
				serverip)

			  msg.channel.send({embed});
				
				
			}
		
		}
};

client.on('ready', () => {
	// nothing for now
});

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Yo this ready!'));

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));

client.on('message', msg => {
	if (!msg.content.startsWith(prefix)) return;
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(prefix.length).split(' ')[0]](msg);
});

client.on('message', async msg => { // eslint-disable-line
	if (msg.author.bot) return undefined;
	if (!msg.content.startsWith(prefix)) return undefined;

	const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
	const serverQueue = queue.get(msg.guild.id);

	let command = msg.content.toLowerCase().split(' ')[0];
	command = command.slice(prefix.length)

	if (command === 'play') {
		const voiceChannel = msg.member.voiceChannel;
		if (!voiceChannel) return msg.channel.send('I\'m sorry but you need to be in a voice channel to play music!');
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.channel.send('I cannot connect to your voice channel, make sure I have the proper permissions!');
		}
		if (!permissions.has('SPEAK')) {
			return msg.channel.send('I cannot speak in this voice channel, make sure I have the proper permissions!');
		}

		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			return msg.channel.send(`âœ… Playlist: **${playlist.title}** has been added to the queue!`);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					msg.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						return msg.channel.send('No or invalid value entered, cancelling video selection.');
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return msg.channel.send('ًں†ک I could not obtain any search results.');
				}
			}
			return handleVideo(video, msg, voiceChannel);
		}
	} else if (command === 'skip') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could skip for you.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
		return undefined;
	} else if (command === 'stop') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing that I could stop for you.');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
		return undefined;
	} else if (command === 'volume') {
		if (!msg.member.voiceChannel) return msg.channel.send('You are not in a voice channel!');
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		if (!args[1]) return msg.channel.send(`The current volume is: **${serverQueue.volume}**`);
		serverQueue.volume = args[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
		return msg.channel.send(`I set the volume to: **${args[1]}**`);
	} else if (command === 'np') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`ًںژ¶ Now playing: **${serverQueue.songs[0].title}**`);
	} else if (command === 'queue') {
		if (!serverQueue) return msg.channel.send('There is nothing playing.');
		return msg.channel.send(`
__**Song queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
**Now playing:** ${serverQueue.songs[0].title}
		`);
	} else if (command === 'pause') {
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return msg.channel.send('âڈ¸ Paused the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	} else if (command === 'resume') {
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return msg.channel.send('â–¶ Resumed the music for you!');
		}
		return msg.channel.send('There is nothing playing.');
	}

	return undefined;
});

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	console.log(video);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`I could not join the voice channel: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
		else return msg.channel.send(`âœ… **${song.title}** has been added to the queue!`);
	}
	return undefined;
}

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`ًںژ¶ Start playing: **${song.title}**`);
}




// Ping pong command
client.on("message", async message => {
  if(message.author.bot) return;
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(prefix) !== 0) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
});


client.login(process.env.TOKEN);
