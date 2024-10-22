import { jettonCheckerModule } from "./modules/jettonCheckerModule.js";

const main = async () => {
  await jettonCheckerModule(200000);
};

try {
  await main();
} catch (e) {
  await main();
}
