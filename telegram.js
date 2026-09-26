export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    if (message?.text === "/start") {
        const token = process.env.BOT_TOKEN;
        const webAppUrl = process.env.WEB_APP_URL;

        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
                                    url: webAppUrl
                                }
                            }
                        ]
                    ]
                }
            })
        });
    }

    return res.status(200).json({ ok: true });
}