export async function handler(event) {
  // ==========================================
  // METHOD CHECK
  // ==========================================
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: false,
        message: "Method Not Allowed"
      })
    };
  }

  // ==========================================
  // PARSE REQUEST
  // ==========================================
  let data;

  try {
    data = JSON.parse(event.body || "{}");
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: false,
        message: "Invalid JSON"
      })
    };
  }

  const {
    token,
    pcName,
    user,
    time
  } = data;

  // ==========================================
  // VALIDATION
  // ==========================================
  if (!token || !pcName || !time) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: false,
        message: "Missing required fields"
      })
    };
  }

  // ==========================================
  // DISCORD EMBED
  // ==========================================
  const message = {
    username: "Eren Xiters",

    embeds: [
      {
        title: "🔓  Ad Unlock Generated",
        description:
          "A new Ad Unlock token has been successfully generated.",

        color: 0x5865F2,

        fields: [
          {
            name: "🎫 Token",
            value: `\`\`\`${token}\`\`\``,
            inline: false
          },

          {
            name: "💻 PC Name",
            value: `\`${pcName}\``,
            inline: true
          },

          {
            name: "👤 User",
            value: `\`${user || "Unknown"}\``,
            inline: true
          },

          {
            name: "🕒 Generated",
            value: `\`${time}\``,
            inline: false
          },

          {
            name: "📌 Status",
            value:
              "```diff\n+ Ad Unlock Successfully Generated\n```",
            inline: false
          }
        ],

        footer: {
          text: "Eren Xiters • Ad Unlock System"
        },

        timestamp: new Date().toISOString()
      }
    ]
  };

  // ==========================================
  // SEND TO DISCORD
  // ==========================================
  try {
    const webhook = process.env.DISCORD_WEBHOOK;

    if (!webhook) {
      console.error("DISCORD_WEBHOOK environment variable is missing.");

      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          success: false,
          message: "Discord webhook is not configured"
        })
      };
    }

    const response = await fetch(webhook, {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(message)
    });

    // ==========================================
    // DISCORD RESPONSE CHECK
    // ==========================================
    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Discord webhook failed:",
        response.status,
        errorText
      );

      return {
        statusCode: 502,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          success: false,
          message: "Discord webhook rejected the request",
          status: response.status
        })
      };
    }

    // ==========================================
    // SUCCESS
    // ==========================================
    return {
      statusCode: 200,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        success: true,
        message: "Discord notification sent successfully"
      })
    };

  } catch (err) {

    console.error(
      "Discord webhook error:",
      err
    );

    return {
      statusCode: 500,

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        success: false,
        message: "Webhook request failed"
      })
    };
  }
}
