import { IncomingWebhook } from "@slack/client";

import config from "../config";

export function sendToSlack({
  title,
  text,
  color = "good"
}: {
  title?: string;
  text: string;
  color?: "good" | "warning" | "danger";
}) {
  const webhook = new IncomingWebhook(config.slack.webhook_url);
  return webhook.send({
    attachments: [
      {
        title,
        text,
        color
      }
    ]
  });
}
