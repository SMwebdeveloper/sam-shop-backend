const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose")
const BaseError = require("../errors/base.error");

// model
const otpModel = mongoose.model("Otp")

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "samandarmirzarahmonov@gmail.com",
        pass: "qfgknnbafxnranpq",
      },
    });
  }

  async sendOtp(to) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    console.log(otp)
    await otpModel.create({
      email: to,
      otp: hashedOtp,
      expireAt: new Date(Date.now() + 5 * 60 * 1000),
    });
    await this.transporter.sendMail({
      from: "samandarmirzarahmonov@gmail.com",
      to,
      subject: `OTP for verification ${new Date().toLocaleString()}`,
      html: `<h1>Your OTP is ${otp}`,
    });
  }
  async verifyOtp(email, otp) {
    const existOtp = await otpModel.find({ email });
    if (!existOtp) throw BaseError.BadRequest("Otp not found");

    const currentOtp = existOtp[existOtp.length - 1];
    if (!currentOtp) throw BaseError.BadRequest("Otp not found");

    if (currentOtp.expireAt < new Date()) {
      throw BaseError.BadRequest("Your otp is expired");
    }

    const isValid = await bcrypt.compare(otp.toString(), currentOtp.otp);
    if (!isValid) throw BaseError.BadRequest("Invalid otp entered");

    await otpModel.deleteMany({ email });
    return true;
  }
  async sendForgotPassword(email, activationLink) {
    try {
      await this.transporter.sendMail({
        from: "samandarmirzarahmonov@gmail.com",
        to: email,
        subject: `Forgot password`,
        html: `
        <div>
            <h1>Time to hacking. If you want to recover your account just click the link below.</h1>
            <a href="${activationLink}">Link to recovercy account</a>
            <b>This link work 15 minuts during</b>
        `,
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = new MailService();
