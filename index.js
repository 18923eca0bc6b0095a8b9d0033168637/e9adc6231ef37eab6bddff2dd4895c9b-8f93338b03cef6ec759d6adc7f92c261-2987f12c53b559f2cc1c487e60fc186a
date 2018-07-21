// Discord.js bot
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    client.user.setActivity('Under Maintenance', {type: 'WATCHING'});
});

client.on('message', msg => {
    if (!msg.content.startsWith(process.env.PREFIX) || !msg.guild) return;
    const command = msg.content.split(' ')[0].substr(process.env.PREFIX.length);
    const args = msg.content.split(' ').slice(1).join(' ');
    if (command === 'help') {
		msg.author.sendMessage("_Our Bot is under Maintenance_");
		msg.channel.send(msg.author + " please check your PM for the help list. :white_check_mark:");
	}
	if( msg.content == "السلام عليكم" ) {
		msg.channel.send(msg.author + " و عليكم السلام ورحمة الله و بركاته ");
	}
    else if (command === 'invite') return msg.channel.send(process.env.INVITE);
});

client.login(process.env.TOKEN);
