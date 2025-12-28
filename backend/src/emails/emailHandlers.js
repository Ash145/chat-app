import { resendEmailClient, sender } from "../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplates.js"

export const sendWelcomeEmail = async (email, name, clientURL) => {
    console.log("email of the receiver", email)
    const { data, error } = await resendEmailClient.emails.send({
        from:  `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to my chat application",
        html: createWelcomeEmailTemplate(name, clientURL)
    });

    if (error) {
        console.error("error sending welcome email", error);
    } else {
        console.log("Email sent successfully: ", data);
    }
};