import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import { isRateLimited } from "@/lib/rate-limit";
import { contactSchema, normalizeContact } from "@/lib/validation";

const recipients = ["aidan@getaxiom.ca", "riley@getaxiom.ca"];

const getIp = (request: NextRequest) => {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
});

export async function POST(request: NextRequest) {
  const ip = getIp(request);

  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid submission payload." }, { status: 400 });
  }

  const contact = normalizeContact(parsed.data);

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return NextResponse.json({ ok: false, error: "Email transport not configured." }, { status: 500 });
  }

  const text = [
    "Axiom Infrastructure - New Intake",
    `Name: ${contact.name}`,
    `Email: ${contact.email}`,
    `Company: ${contact.company || "N/A"}`,
    "",
    contact.message,
  ].join("\n");

  const html = `
    <h2>Axiom Infrastructure - New Intake</h2>
    <p><strong>Name:</strong> ${contact.name}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Company:</strong> ${contact.company || "N/A"}</p>
    <p><strong>Message:</strong></p>
    <p>${contact.message.replace(/\n/g, "<br />")}</p>
  `;

  try {
    await transporter.sendMail({
      from: process.env.CONTACT_FROM || process.env.SMTP_USER,
      replyTo: contact.email,
      to: recipients,
      subject: `New Axiom Intake - ${contact.company || contact.name}`,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to dispatch message." }, { status: 500 });
  }
}
