const Discord = require('discord.js');
const request = require('request');
const authDetails = require('./auth.json');
const bot = new Discord.Client({ autoReconnect: true });
const commands = require('./bot/commands.js');

bot.on('ready', () =>
{
    const botTestChannel = bot.channels.find('name', 'bottestchannel');

    botTestChannel.send('Boo Boo Bee Doo... Omnic is ready to serve its CC337 Overlords!');

    console.log(`Bot Online`);

    bot.user.setGame('$help');
});

// Handles commands
bot.on('message', (msg) =>
{
    commands.process(bot, msg);
});

bot.on('guildMemberAdd', (guildMember) =>
{
    // Send a DM to the new user explaining our rules.
    bot.users.get(guildMember.user.id).send('',
    {
        embed:
        {
            color: 65380,
            description: `Welcome to **Charlie Company 337**! We are a casual gaming group that has a ton of fun together. We're very active here in Discord, have games going every night and group events throughout the month.

__**There are a few things you need to do to gain full access to the Discord:**__

     1. Join our group on the100.io. This is where we schedule our games. You can still do PUGs in Discord, but this is the core of our group. https://www.the100.io/g/3140

     2. Be sure to right click your name in Discord and select "Change Nickname." If your main game is a blizzard game use your BattlenetId. If it's a Steam game like PUBG please change your nickname to match your Steam name and format like this: "Username (Steam)." See here for more info: https://support.discordapp.com/hc/en-us/articles/219070107-Server-Nicknames

     3. Familiarize yourself with our ${bot.channels.find('name', 'rules_and_info')}.

     4. Once you've done everything above, post in ${bot.channels.find('name', 'welcome_new_members')} to get promoted to Grunt and have full acess to our Discord.

That's it! If you have any questions, please let a member of the leadership team know or post in ${bot.channels.find('name', 'welcome_new_members')} for help.`
        }
    });

    const newMemberChannel = guildMember.guild.channels.find('name', 'welcome_new_members');

    const leadershipChannel = guildMember.guild.channels.find('name', 'company_leadership');

    const memberLogChannel = guildMember.guild.channels.find('name', 'member_log');

    // Post a message in welcome_new_members/company_leadership/member_log notifying users of new member.
    newMemberChannel.send(`Hey everyone! We have a new member. Please welcome ${guildMember.user} to our group! ${guildMember.user}, please read the post at the top of this channel for more information on how to get promoted to Grunt and be given access to the rest of the Discord. Happy gaming!`);

    leadershipChannel.send(`Hey leadership team! We have a new member. Please be sure to welcome them and encourage them to participate! New Member = ${guildMember.user}`);

    memberLogChannel.send(`New Member = ${guildMember.user}`);
});

// When a user is removed for any reason (kicked/left on own) displays a message in
// member log channel to notify mods and keep track of who has left.
bot.on('guildMemberRemove', (guildMember) =>
{
    const memberLogChannel = guildMember.guild.channels.find('name', 'member_log');

    memberLogChannel.send(`Member Left = ${guildMember.user}`);
})

// When a member is promoted to grunt/trooper, post a message in general
bot.on('guildMemberUpdate', (oldMember,newMember) =>
{
    const generalChannel = newMember.guild.channels.find('name', 'general');

    // If roles have been updated
    if(oldMember.roles.equals(newMember.roles) == false) {

        // If the new role added is grunt, send message to general channel
        if(oldMember.roles.exists('name','Grunt') == false && newMember.roles.exists('name','Grunt')) {
            generalChannel.send(`Please welcome our newest grunt ${newMember.user}! Take a moment to introduce yourself in ${newMember.guild.channels.find('name', 'introductions')} and pick up some roles in ${newMember.guild.channels.find('name', 'role_requests')}. We're glad you joined us!`);
        }

        // If the new role added is trooper, send a message to general channel
        else if (oldMember.roles.exists('name','Trooper') == false && newMember.roles.exists('name','Trooper')) {
            generalChannel.send(`Congrats to ${newMember.user} on making Trooper status! Thanks for playing with us! :dorito:`);
        }
    }
})

// When the bot shuts down for whatever reason we post a msg in bottestchannel
// to keep a log and notify bot admins.
bot.on('disconnect', (msg) =>
{
    const botTestChannel = bot.channels.find('name', 'bottestchannel');

    botTestChannel.send('Bee Bee Boop ... Bot Disconnected');
});

// Debug Handler
bot.on('debug', (e) =>
{
    console.info(e);
});

// Warning Handler
bot.on('warn', (e) =>
{
    console.warn(e);
});

// Error Handler
bot.on('error', (e) =>
{
    console.error(e);
});

// Discord.js command to log the bot in to discord. Uses authDetails json file
bot.login(authDetails.token);