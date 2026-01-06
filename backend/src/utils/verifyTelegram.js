import crypto from "crypto";

export function verifyTelegram(initData, botToken) {
  const secret = crypto
    .createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();

  const checkString = initData
    .split("&")
    .filter(v => !v.startsWith("hash="))
    .sort()
    .join("\n");

  const hash = crypto
    .createHmac("sha256", secret)
    .update(checkString)
    .digest("hex");

  return initData.includes(`hash=${hash}`);
}
