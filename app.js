Telegram.WebApp.ready();
Telegram.WebApp.expand();

const user = Telegram.WebApp.initDataUnsafe.user;
const form = document.getElementById("reportForm");
const submitBtn = document.getElementById("submitBtn");

document.getElementById("userInfo").innerText =
  user ? `👤 ${user.first_name}` : "";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerText = "⏳ Yuborilmoqda...";

  const payload = {
    telegram_id: user.id,
    username: user.username || user.first_name,
    title: title.value.trim(),
    content: content.value.trim(),
    group_telegram_id: Number(group.value)
  };

  try {
    const res = await fetch("BACKEND_URL/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Xatolik");

    Telegram.WebApp.showPopup({
      title: "✅ Muvaffaqiyatli",
      message: "Hisobot yuborildi",
      buttons: [{ type: "close" }]
    });

    setTimeout(() => Telegram.WebApp.close(), 1000);
  } catch (err) {
    Telegram.WebApp.showPopup({
      title: "❌ Xatolik",
      message: "Qayta urinib ko‘ring",
      buttons: [{ type: "close" }]
    });

    submitBtn.disabled = false;
    submitBtn.innerText = "🚀 Hisobotni yuborish";
  }
});
