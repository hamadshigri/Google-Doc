import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 20000,
});

export const sendInvitationEmail = async ({
  inviteeEmail,
  documentTitle,
  role,
  invitationId,
}) => {
  const frontendUrl = process.env.FRONTEND_URL?.replace(/\/$/, "");
  const invitationLink = `${frontendUrl}/invitations/${invitationId}`;

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME || "Google Docs Clone",
      },
      to: [{ email: inviteeEmail }],
      subject: "You've been invited to a document",
      htmlContent: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Document Invitation</h2>
                <p>You have received an invitation to access a document.</p>
                <h3>${documentTitle}</h3>
                <p>Your permission: <strong>${role}</strong></p>
                <a href="${invitationLink}">View Invitation</a>
                <p>${invitationLink}</p>
            </div>
        `,
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      `Brevo API error ${response.status}: ${JSON.stringify(result)}`,
    );
  }

  return result;
};
