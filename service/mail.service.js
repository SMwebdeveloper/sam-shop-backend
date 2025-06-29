const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const otpModel = require("../models/otp.model");
const BaseError = require("../errors/base.error");

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
  //  console.log("email", to)
  //  console.log("otp", otp)
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
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
}

module.exports = new MailService();
