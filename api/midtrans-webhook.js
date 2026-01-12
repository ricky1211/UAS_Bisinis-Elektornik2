import midtransClient from 'midtrans-client';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).send('OK');

  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    const statusResponse = await snap.transaction.notification(req.body);
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'accept' || !fraudStatus) {
        // Kirim Email
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
          }
        });

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: statusResponse.customer_details?.email || req.body.email,
          subject: '✅ Pembelian Berhasil - Link Download Produk',
          html: `<p>Terima kasih telah membeli. Berikut link download Anda: ${process.env.PRODUCT_DOWNLOAD_URL}</p>`
        });
      }
    }
    res.status(200).send('OK');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}