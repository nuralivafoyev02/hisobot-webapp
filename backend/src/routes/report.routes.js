import express from "express";
import { supabase } from "../db/supabase.js";
import { bot } from "../bot/bot.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { telegram_id, username, title, content, group_telegram_id } = req.body;

  /* user */
  const { data: user } = await supabase
    .from("users")
    .upsert({ telegram_id, username })
    .select()
    .single();

  /* group */
  const { data: group } = await supabase
    .from("groups")
    .select()
    .eq("telegram_group_id", group_telegram_id)
    .single();

  /* report */
  await supabase.from("reports").insert({
    user_id: user.id,
    group_id: group.id,
    title,
    content
  });

  /* send to telegram */
  await bot.sendMessage(
    group_telegram_id,
    `📌 ${title}\n\n${content}\n\n👤 ${username}`
  );

  res.json({ success: true });
});

export default router;
