import "dotenv/config";
import { httpRequest } from "./httpRequestService.js";
import { Address } from "@ton/core";

export const getTokenData = async () => {
  const res = await httpRequest(
    `https://tonapi.io/v2/accounts/${process.env.WALLET_ADDR}/jettons`,
  );
  return (res?.balances.filter((balance) => {
    return (
      balance &&
      balance.jetton &&
      balance.jetton.address &&
      Address.normalize(balance.jetton.address) === process.env.JETTON_MASTER
    );
  }))[0].balance;
};
