import express from "express";
import { json } from "express";
import { createTransport } from "nodemailer";
import cors from "cors"; 

const app = express();
const PORT = 3001;

app.use(json());

app.use(cors());

app.post("/send-email", (req, res) => {
  const { name, number, time } = req.body;

  // Create a transporter using nodemailer
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "owaisnazir201@gmail.com",
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: "owaisnazir201@gmail.com",
    to: "owaisnazir110928@gmail.com",
    subject: "New Callback Request",
    html: `<p><strong>Dear Team,</strong></p>
    <p>A new callback request has been submitted through our website. Below are the details:</p>
    <ul>
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Mobile Number:</strong> ${number}</li>
      <li><strong>Preferred Time:</strong> ${time}</li>
    </ul>
    <p>Please ensure to reach out to the requester at the provided contact number during the specified preferred time. If you have any questions or need further assistance, feel free to contact us.</p>
    <p>Thank you and best regards,</p>
    <p><strong>Anchors Team</strong></p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email Sent Successfully");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
