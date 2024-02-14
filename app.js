const { Client, GatewayIntentBits, ActivityType, EmbedBuilder } = require('discord.js');
const { fetchPairData } = require('./utils');

const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
  ] 
});
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
  const data = await fetchPairData()
  client.user.setActivity(`$${data.pair.priceUsd}`, { type: ActivityType.Watching })
}

const boardcast = async () => {
  const data = await fetchPairData()

  // Send message to all channels from specific channel ids
  const channelIds = process.env.TARGET_CHANNEL_IDS.split(',');

  if (process.env.MESSAGE_TYPE === 'text') {
    _boardcastText(channelIds, data);
  } else {
    _boardcastEmbed(channelIds, data);
  }
}

const _boardcastEmbed = async (channelIds, data) => {
  for (const channelId of channelIds) {
    const channel = await client.channels.fetch(channelId);

    // [Optional] Let the chaanel only keep latest message
    const messages = await channel.messages.fetch({ limit: 100 });

    let targetMsg = null;
    // let ftPriceField = null;
    let m5ChangeField = null;
    
    for (const message of messages.values()) {
      const embedMsg = message.embeds[0];
      if (embedMsg) {
        m5ChangeField = embedMsg.fields.find(field => field.name === '5M');

        if (m5ChangeField) {
          targetMsg = message;
          break;
        }
      }
    }
    // If you can't see any message, please check the bot's permission
    // console.log(messages)

    if (m5ChangeField &&
        m5ChangeField.value === `${data.pair.priceChange.m5}%`) {
      // same 5m change rate, no need to update
      continue;
    } else if (m5ChangeField && m5ChangeField.value !== `$${data.pair.priceChange.m5}`) {
      // price changed, delete the old message
      await targetMsg.delete();
    }

    // no existed message or price changed, send a new message
    const embedMsg = new EmbedBuilder()
      .setTitle('丹 Price')
      .setURL(`https://dexscreener.com/${process.env.CHAIN}/${process.env.PAIR_HASH}`)
      .setAuthor({ name: 'mmq88x', iconURL: 'https://i.imgur.com/8NJckwc.png', url: 'https://twitter.com/mmq88x' })
      .setDescription(`這是現在 PFPAsia 最大流動池的即時價格監控機器人，你可以點擊標頭查看更詳細的資訊。\n` +
                      `This is the realtime price monitoring bot of PFPAsia's largest pool now.` +
                      `You can click on the title to view more detailed information.`)
      .addFields(
        { name: '<:coin:1207027215414460416> FT Price', value: `$${data.pair.priceUsd}` },
        { name: '5M', value: `${data.pair.priceChange.m5}%`, inline: true },
        { name: '1H', value: `${data.pair.priceChange.h1}%`, inline: true },
        { name: '6H', value: `${data.pair.priceChange.h6}%`, inline: true },
        { name: '24H', value: `${data.pair.priceChange.h24}%`, inline: false },
        { name: '<:liquidity:1207026179639484506> Liquidity', value: `$${data.pair.liquidity.usd}`, inline: true },
        { name: '<:diamond:1207023588000010321> Market cap', value: `$${data.pair.fdv}`, inline: true },
      )
      .setThumbnail('https://i.imgur.com/ys8mjvO.png')
      .setFooter({ text: 'Update time', iconURL: 'https://i.imgur.com/ys8mjvO.png' })
      .setColor([227, 23, 13])
      .setTimestamp();

    await channel.send({ embeds: [embedMsg] });
    
  }
}

const _boardcastText = async (channelIds, data) => {
  for (const channelId of channelIds) {
    const channel = await client.channels.fetch(channelId);

    // [Optional] Let the chaanel only keep latest message
    const messages = await channel.messages.fetch({ limit: 100 });
    
    // If you can't see any message, please check the bot's permission
    // console.log(messages)
    const price = data.pair.priceUsd;
    const priceSameMsg = messages.find(
      (msg) => msg.content === `丹 DAN Price: $${price}`
    );

    if (priceSameMsg) {
      continue;
    }

    const priceDifferentMsg = messages.find(
      (msg) => msg.content.startsWith('丹 DAN Price:') && msg.content !== `丹 DAN Price: $${price}`
    );

    if (priceDifferentMsg) {
      await priceDifferentMsg.edit(`丹 DAN Price: ${price}`);
      continue;
    }

    // No existed message from the bot, send a new message
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