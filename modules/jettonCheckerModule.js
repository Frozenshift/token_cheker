import { sleep } from "../utils/utils.js";
import { bot } from "../services/tgService.js";
import { getTokenData } from "../services/getJettonCountService.js";
import { fromNano } from "@ton/core";
let jettonBalance = 0;

export const jettonCheckerModule = async (minJettonCount) => {
  while (true) {
    const JettonCountFromWallet = +fromNano(await getTokenData());

    if (
      JettonCountFromWallet < minJettonCount &&
      jettonBalance !== JettonCountFromWallet
    ) {
      await bot.sendMessage(
        process.env.TG_ID,
        `Баланс меньше ${minJettonCount}. Текущий баланс: ${JettonCountFromWallet} !!!!`,
      );
    }

    jettonBalance = JettonCountFromWallet;
    await sleep(3000);
  }
};

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  await bot.sendMessage(chatId, "Бот запущен.");
});
