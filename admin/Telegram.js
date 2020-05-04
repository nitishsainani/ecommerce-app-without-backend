import { TelegramClient } from "messaging-api-telegram";
import { getTable } from '../mongo/db'

let client = null;

let telegramData = null;

export const test = async () => {
  if(!telegramData) {
    let res = await getTable('telegram');
    telegramData = res[0];
  }
  let apiKey = telegramData.api_key;
  console.log(apiKey);
  if (!client) {
    client = TelegramClient.connect(apiKey);
  }
  client.getUpdates({limit: 10,})
    .then(updates => {
      console.log('update' + JSON.stringify(updates));
    })
}

export const sendMessage = async (message) => {
  if(!telegramData) {
    let res = await getTable('telegram');
    telegramData = res[0];
  }

  let chatIds = JSON.parse(telegramData.chat_id);
  let apiKey = telegramData.api_key;
  console.log(apiKey);
  if (!client) {
    client = TelegramClient.connect(apiKey);
  }
  for(let i=0; i<chatIds.length; ++i) {
    client.sendMessage(chatIds[i], message, {
      disable_web_page_preview: true,
    }).then(r => console.log(r));
  }
}