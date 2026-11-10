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
    const invitationLink =
        `${process.env.FRONTEND_URL}/invitations/${invitationId}`;

    const info = await transporter.sendMail({
        from: `"Google Docs Clone" <${process.env.EMAIL_USER}>`,
        to: inviteeEmail,
        subject: "You've been invited to a document",

        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Document Invitation</h2>
                <p>You have received an invitation to access a document.</p>
                <h3>${documentTitle}</h3>
                <p>Your permission: <strong>${role}</strong></p>
                <a href="${invitationLink}">View Invitation</a>
                <p>${invitationLink}</p>
            </div>
        `,
    });

    return info;
};
