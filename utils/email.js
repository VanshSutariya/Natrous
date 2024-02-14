const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    // 1)create transporter

    // mailtrap
    // const transporter = nodemailer.createTransport({
    //   host: 'sandbox.smtp.mailtrap.io',
    //   port: 587,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     PASS: process.env.EMAIL_PASSWORD,
    //   },
    // });

    // ETHEREAL
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'malachi.gleichner@ethereal.email',
        pass: 'bpCz1Ea8VHtjDK45MZ',
      },
    });
    // 2)define the email options
    const mailOptions = {
      from: 'Jonas Schmedtion <jonas@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
    // 3)actual send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};

module.exports = sendEmail;
