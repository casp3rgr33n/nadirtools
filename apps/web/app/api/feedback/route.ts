import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, category, subject, message, turnstileToken } = body;

    // 1. Basic validation
    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: "Subject and Message fields are required." },
        { status: 400 }
      );
    }

    // 2. Cloudflare Turnstile token validation
    const ip = request.headers.get("cf-connecting-ip") || undefined;
    const isHuman = await verifyTurnstile(turnstileToken, ip);
    if (!isHuman) {
      return NextResponse.json(
        { success: false, error: "Turnstile verification failed. Please try again." },
        { status: 403 }
      );
    }

    // 3. Forward payload to Discord Webhook
    const isSent = await sendDiscordWebhook({
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      category: sanitizeInput(category),
      subject: sanitizeInput(subject),
      message: sanitizeInput(message),
    });

    if (!isSent) {
      return NextResponse.json(
        { success: false, error: "Failed to dispatch feedback notification." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Feedback route error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}

// Input sanitizer to prevent HTML injections or webhook breakages
function sanitizeInput(val: string): string {
  if (!val) return "";
  return val
    .replace(/[<>]/g, "") // remove simple HTML brackets
    .substring(0, 2000) // prevent message payload length limits
    .trim();
}

async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.warn("TURNSTILE_SECRET_KEY is missing. Skipping Turnstile verification (Development Mode).");
    return true; // Bypass check in local dev if no key is configured
  }

  if (!token) {
    return false;
  }

  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (ip) {
      formData.append("remoteip", ip);
    }

    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    });
    const outcome = (await res.json()) as { success: boolean };
    return outcome.success;
  } catch (e) {
    console.error("Error verifying Turnstile token:", e);
    return false;
  }
}

async function sendDiscordWebhook(payload: {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn("DISCORD_WEBHOOK_URL is missing. Printing feedback to console instead:");
    console.log("---- FEEDBACK PAYLOAD ----");
    console.log(payload);
    console.log("--------------------------");
    return true; // Return success in local dev when webhook is not configured
  }

  try {
    const embed = {
      title: `📬 New Feedback Received`,
      description: `A user has submitted feedback or reported a bug.`,
      color: 3419742, // Hex #34C759 translated to Decimal (Leaf Green)
      fields: [
        {
          name: "👤 Submitter",
          value: payload.name || "Anonymous",
          inline: true,
        },
        {
          name: "✉️ Email",
          value: payload.email || "No email provided",
          inline: true,
        },
        {
          name: "🏷️ Category",
          value: payload.category || "General",
          inline: true,
        },
        {
          name: "📝 Subject",
          value: payload.subject,
        },
        {
          name: "💬 Message",
          value: payload.message,
        },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "NadirTools Audit System",
      },
    };

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [embed],
      }),
    });

    return res.ok;
  } catch (e) {
    console.error("Error posting to Discord Webhook:", e);
    return false;
  }
}
