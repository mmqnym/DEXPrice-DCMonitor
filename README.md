# DEXPrice-DCMonitor

> 這是一個使用 [DexScreener](https://docs.dexscreener.com/) API 監控價格的 Discord 機器人。

> This is a Discord bot that monitors prices using the [DexScreener](https://docs.dexscreener.com/) API.

## 設置 Setup

將 `example.env` 更改為 `.env` 並修改裡面的內容

Rename example.env to .env and modify its contents as follows:

中文

```py
DISCORD_TOKEN="Your Token" # 填入你的 Discord bot token
TARGET_CHANNEL_IDS="Your Channel ID" # 以',', ex: 123456789,987654321
CHAIN="ethereum" # 詳細的名稱清單請參考 https://docs.dexscreener.com/api/reference
PAIR_HASH="0x646946F0518c6Ba27f1B2C6b4387EC6035bC42e3" # 範例交易對，使用的是 "丹 - PFPAsia" 的非官方交易對
UPDATE_FREQUENCY = 5000 # in milliseconds

MESSAGE_TYPE="embed" # embed or text, default is text

# TASKs
UPDATE_STATUS="on" # 讓機器人將價格反應在狀態上，"on" 開啟 or "off" 關閉
BOARDCAST="off" # 讓機器人發送價格訊息到 "TARGET_CHANNEL_IDS" 指定的頻道，"on" 開啟 or "off" 關閉
```

English

```py
DISCORD_TOKEN="Your Token" # Fill in your Discord bot token
TARGET_CHANNEL_IDS="Your Channel ID" # Separated by ',', e.g., 123456789,987654321
CHAIN="ethereum" # For a detailed list of names, please refer to https://docs.dexscreener.com/api/reference
PAIR_HASH="0x646946F0518c6Ba27f1B2C6b4387EC6035bC42e3" # Example pair hash for the unofficial "Dan - PFPAsia" pair
UPDATE_FREQUENCY = 5000 # in milliseconds

MESSAGE_TYPE="embed" # embed or text, default is text

# TASKs
UPDATE_STATUS="on" # Enable or disable the bot's ability to reflect prices in status. Use "on" or "off".
BOARDCAST="off" # Enable or disable the bot's ability to send price messages to the channels specified in "TARGET_CHANNEL_IDS". Use "on" or "off".
```

## 執行 Run

之後使用 docker compose 一鍵啟動即可

Afterwards, use Docker Compose to start the bot with a single command:

```sh
docker compose up -d --build
```

或使用 node 執行原始碼

Alternatively, you can run the source code using Node:

```sh
npm i
npm run start
```
