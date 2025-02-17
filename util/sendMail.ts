import nodemailer from "nodemailer";
import {verifyEmail} from "../db/prisma-data-user-store";

const OTP_STORE = new Map<string, string>();

const SendMail = async (email: string) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const otp = Math.floor(100000 + Math.random() * 900000)

    const mailOptions : nodemailer.SendMailOptions = {
        from : process.env.EMAIL,
        to : email,
        subject : "Reset Your Password - Note Craft",
        text : "Your OTP to reset the password is: " + otp
    }

    const isValidMail = await verifyEmail(email)

    if (isValidMail) {
        OTP_STORE.set(email, otp.toString())

        try{
            const response = await transporter.sendMail(mailOptions)
            console.log("Email sent: " + response.response)
            return response
        }catch(err){
            console.log("Error on sending email: ", err)
        }
    } else {
        console.log("Invalid email")
        return null
    }

}

export const verifyOTP = (email: string, otp: string) => {
    if (OTP_STORE.has(email)) {
        return OTP_STORE.get(email) === otp
    }
    return false
}

export default SendMail