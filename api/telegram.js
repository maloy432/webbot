const BOT_TOKEN = "8545433215:AAEDE1jpFHjYMID7jTjMfvvZ3lyHTeEAfvU";
const WEB_APP_URL = "https://webbotqhfu.vercel.app/";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  const message = req.body?.message;

  if (message?.text === "/start") {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: message.chat.id,
        text: "Добро пожаловать в Leosin!",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Открыть приложение",
                web_app: {
                  url: WEB_APP_URL,
                },
              },
            ],
          ],
        },
      }),
    });
  }

  return res.status(200).json({ ok: true });
};
