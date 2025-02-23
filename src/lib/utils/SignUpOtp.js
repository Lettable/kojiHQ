import nodemailer from "nodemailer";

const sendOtpEmail = async (toEmail, otp, purpose) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const purposes = {
    "sign-up": {
      subject: "Your Sign-Up OTP Code",
      message: `
        <h2>Welcome to Suized!</h2>
        <p>Use the OTP below to complete your sign-up:</p>
      `,
    },
    "password-reset": {
      subject: "Your Password Reset OTP Code",
      message: `
        <h2>Reset Your Password</h2>
        <p>Use the OTP below to reset your password:</p>
      `,
    },
  };

  const { subject, message } = purposes[purpose] || purposes["sign-up"];

  const mailOptions = {
    from: `"Suized" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #000000;
            color: #FFFFFF;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #18181B;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          .header {
            background: linear-gradient(to right, #EAB308, #F59E0B);
            text-align: center;
            padding: 20px;
          }
          .header img {
            width: 80px;
            height: 80px;
            margin-bottom: 10px;
          }
          .header h1 {
            margin: 0;
            color: #000000;
            font-size: 28px;
            font-weight: bold;
          }
          .content {
            padding: 30px;
            text-align: center;
            background-color: #18181B;
          }
          .otp {
            font-size: 32px;
            font-weight: bold;
            margin: 20px 0;
            color: #EAB308;
            background-color: rgba(234, 179, 8, 0.1);
            border: 2px solid #EAB308;
            padding: 15px 30px;
            border-radius: 12px;
            display: inline-block;
            letter-spacing: 4px;
          }
          .footer {
            background-color: #27272A;
            text-align: center;
            padding: 20px;
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
          }
          .footer a {
            color: #EAB308;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
          .blur-effect {
            position: absolute;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: rgba(234, 179, 8, 0.15);
            filter: blur(50px);
            z-index: 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://i.postimg.cc/85s7TkJz/suize-364-424-og-white-logo.png" alt="Suized Logo">
            <h1>Suized</h1>
          </div>
          <div class="content">
            <div class="blur-effect" style="top: 20%; left: 20%;"></div>
            <div class="blur-effect" style="bottom: 20%; right: 20%;"></div>
            ${message}
            <div class="otp">${otp}</div>
            <p style="color: rgba(255, 255, 255, 0.6);">This OTP is valid for 15 minutes. Please do not share it with anyone.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Suized. All rights reserved.</p>
            <p>If you did not request this email, please ignore it.</p>
            <p>Need help? Contact us at <a href="mailto:support@suized.com">support@suized.com</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

export default sendOtpEmail;
