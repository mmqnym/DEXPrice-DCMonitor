const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { fetchPrice } = require('./utils');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const dotenv = require('dotenv');

dotenv.config()

TASK_QUEUE = []

const registTask = async () => {
  if (process.env.UPDATE_STATUS == 'on') {
    TASK_QUEUE.push(updateStatus);
  }

  if (process.env.BOARDCAST == 'on') {
    TASK_QUEUE.push(boardcast);
  }
}

const doTask = async () => {
  await TASK_QUEUE.forEach(async (task) => {
    await task();
  });
}

const updateStatus = async () => {
  const price = await fetchPrice()
  client.user.setActivity(`$${price}`, { type: ActivityType.Watching })
}

const boardcast = async () => {
  const price = await fetchPrice()

  // send message to all channels from specific channel ids
  const channelIds = process.env.TARGET_CHANNEL_IDS.split(',');

  for (const channelId of channelIds) {
    const channel = await client.channels.fetch(channelId);
    await channel.send(`丹 DAN Price: $${price}`);
  }
}

client.on('ready', () => {
  client.user.setActivity('丹 DAN Price', { type: ActivityType.Watching })
  console.log(`Logged in as ${client.user.tag}!`);
  registTask();
  
  setInterval(async () => {
    doTask();
  }, process.env.UPDATE_FREQUENCY);
});

client.login(process.env.DISCORD_TOKEN);