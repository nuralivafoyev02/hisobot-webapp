import TelegramBot from "node-telegram-bot-api";
import { supabase } from "../db/supabase.js";

export const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// /start handler
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const telegramId = msg.from.id;
  const username = msg.from.username || msg.from.first_name;

  // 1️⃣ Foydalanuvchini Supabase'da saqlash
  const { data: user } = await supabase
    .from("users")
    .upsert({ telegram_id: telegramId, username })
    .select()
    .single();

  // 2️⃣ Foydalanuvchining hisobotlarini olish
  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (reports.length === 0) {
    // 3️⃣ Agar hisobot yo'q → Web App link
    await bot.sendMessage(
      chatId,
      `Hozircha hisobot yaratilmagan. Siz uni istalgan vaqtda quyidagi saytdan yaratishingiz mumkin:\n\nhttps://hisobot-webapp.vercel.app`,
      {
        parse_mode: "Markdown"
      }
    );
  } else {
    // 4️⃣ Agar hisobotlar mavjud → ro'yxatini ko'rsatish
    let text = "📋 Sizning hisobotlaringiz:\n\n";
    reports.forEach((r, idx) => {
      text += `${idx + 1}. *${r.title}* - ${new Date(r.created_at).toLocaleDateString()}\n`;
    });

    text += `\nYangi hisobot yaratish uchun: https://hisobot-webapp.vercel.app`;

    await bot.sendMessage(chatId, text, { parse_mode: "Markdown" });
  }
});
