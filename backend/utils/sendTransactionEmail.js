const nodemailer = require('nodemailer');

const sendTransactionEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const { email, name, orderID, subject, orderDetails } = options;

    const htmlContent = `
        <p>Dear ${name},</p>
        <p>Thank you for your purchase. Below are the details of your order:</p>
        <h1> Order ID: ${orderID} </h1>
        <ul>
            ${orderDetails.map(item => 
                `<li> Photo: ${item.photo} <br>
                        Material: ${item.material} <br>
                        Price: ${item.price} <br>
                        Quantity: ${item.quantity}
                </li>`).join('')}
        </ul>
        <p>Total Price: ${orderDetails.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
        <p> To see more detail, visit the shop. </p>
        <p>Regards,<br/>${process.env.SMTP_FROM_NAME}</p>
    `;

    const message = {
        from: `${process.env.SMTP_FROM_EMAIL}`,
        to: email,
        subject: subject,
        html: htmlContent
    };
    
    await transporter.sendMail(message);
};

module.exports = sendTransactionEmail;
