import TelegramBot from "node-telegram-bot-api";
import "dotenv/config";
export const bot = new TelegramBot(process.env.TG_BOT_API_KEY, {
  polling: true,
});
