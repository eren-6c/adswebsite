export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { token, pcName, user, time } = JSON.parse(event.body);

  const message = {
    content:
`🔑 **Ad Unlock Successfully !**

**Token:** \`${token}\`
**PC Name:** ${pcName}
**User:** ${user}
**Time:** ${time}`
  };

  try {
    await fetch(process.env.DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message)
    });

    return {
      statusCode: 200,
      body: "OK"
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Webhook failed"
    };
  }
}
