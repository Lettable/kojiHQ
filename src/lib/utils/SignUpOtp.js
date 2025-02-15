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
        <h2>Welcome to Koji Marketplace!</h2>
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
    from: `"Koji Marketplace" <${process.env.EMAIL_USER}>`,
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
            background-color: #1A202C;
            color: #EDF2F7; 
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #2D3748;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
            overflow: hidden;
          }
          .header {
            background-color: #4A5568; 
            text-align: center;
            padding: 20px;
            color: #F6E05E;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .header p {
            margin: 5px 0 0;
            font-size: 14px;
            color: #E2E8F0;
          }
          .content {
            padding: 20px;
            text-align: center;
          }
          .otp {
            font-size: 24px;
            font-weight: bold;
            margin: 15px 0;
            color: #F6E05E;
            background-color: #1A202C;
            border: 2px solid #F6E05E;
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
          }
          .footer {
            background-color: #4A5568; 
            text-align: center;
            padding: 10px;
            color: #E2E8F0; 
            font-size: 12px;
          }
          .footer a {
            color: #63B3ED;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Koji Marketplace</h1>
            <p>Your Gateway to Premium Services</p>
          </div>
          <div class="content">
            ${message}
            <div class="otp">${otp}</div>
            <p>The OTP is valid for 15 minutes. Please do not share it with anyone.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Koji Marketplace. All rights reserved.</p>
            <p>If you did not request this email, please ignore it. For help, contact <a href="mailto:mirzyadev@gmail.com">mirzyadev@gmail.com</a>.</p>
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
