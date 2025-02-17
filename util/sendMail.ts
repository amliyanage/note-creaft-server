import nodemailer from "nodemailer";

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


    try{
        const response = await transporter.sendMail(mailOptions)
        console.log("Email sent: " + response.response)
        return response
    }catch(err){
        console.log("Error on sending email: ", err)
    }

}

export default SendMail