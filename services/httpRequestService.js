import { logger } from "../logger/logger.js";
import { sleep } from "../utils/utils.js";

export async function httpRequest(
  url,
  maxRetries = 10,
  limit = true,
  delay = 0,
  method = "GET",
  data = null,
) {
  try {
    const headers = {};
    let body;

    if (data) {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }

    const options = {
      method,
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers,
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body,
    };

    async function getResponse(url, options, delay = 0, retries = 0) {
      await sleep(delay);
      let response;

      try {
        response = await fetch(url, options);
      } catch (error) {
        logger.error(`Fetch failed: ${error.message}`);
        if (retries < maxRetries) {
          logger.info(`Retrying... (${retries + 1}/${maxRetries})`);
          if (!limit) {
            retries = 0;
          }
          return getResponse(url, options, 1000, retries + 1);
        } else {
          logger.error("Max retries reached. Request failed.");
          return null;
        }
      }

      if (response.status === 429) {
        logger.error(`Too many requests, retrying after delay...`);
        if (!limit) {
          retries = 0;
        }
        return getResponse(url, options, 1000, retries + 1);
      }

      if (response.ok) {
        logger.info(`Response OK: ${response.status}`);
        const contentType = response.headers.get("Content-Type");
        if (
          contentType &&
          contentType.toLowerCase().includes("application/json")
        ) {
          const jsonResponse = await response.json();
          if (jsonResponse !== null) {
            return jsonResponse;
          } else {
            logger.error("Received null response data.");
          }
        } else {
          logger.warn(
            `Response headers error: ${response.headers.get("content-type")}`,
          );
        }
      } else {
        logger.error(`Response Error: ${response.status}`);
      }

      if (retries < maxRetries) {
        logger.info(`Retrying... (${retries + 1}/${maxRetries})`);
        if (!limit) {
          retries = 0;
        }
        return getResponse(url, options, 0, retries + 1);
      } else {
        logger.error("Max retries reached. Request failed.");
        return null;
      }
    }

    const jsonResponse = await getResponse(url, options);

    if (jsonResponse) {
      logger.info("Request succeeded");
      return jsonResponse;
    } else {
      logger.error("Request ultimately failed.");
      return null;
    }
  } catch (error) {
    logger.error(`Unexpected error: ${error.message}`);
    return null;
  }
}
