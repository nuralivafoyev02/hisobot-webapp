import TelegramBot from "node-telegram-bot-api";
import { supabase } from "../db/supabase.js";

export const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: true
});

/* Bot guruhga qo‘shilganda */
bot.on("my_chat_member", async (msg) => {
  if (msg.new_chat_member.status === "member") {
    await supabase.from("groups").upsert({
      telegram_group_id: msg.chat.id,
      title: msg.chat.title
    });
  }
});
