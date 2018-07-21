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
    if (command === 'help') return msg.channel.send('_Our Bot is Under Maintenance_');
    else if (command === 'invite') return msg.channel.send(process.env.INVITE);
});

client.login(process.env.TOKEN);
