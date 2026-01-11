const midtransClient = require('midtrans-client');
const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Inisialisasi API client untuk verifikasi
    let apiClient = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    const notification = req.body;
    
    // Verifikasi signature
    const statusResponse = await apiClient.transaction.notification(notification);
    
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    // Logika berdasarkan status pembayaran
    if (transactionStatus === 'capture') {
      if (fraudStatus === 'accept') {
        // Pembayaran berhasil - kirim produk
        await sendProduct(statusResponse);
      }
    } else if (transactionStatus === 'settlement') {
      // Pembayaran settlement - kirim produk
      await sendProduct(statusResponse);
    } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
      // Pembayaran gagal/dibatalkan
      console.log('Payment failed for order:', orderId);
    } else if (transactionStatus === 'pending') {
      // Pembayaran pending
      console.log('Waiting payment for order:', orderId);
    }

    res.status(200).json({ status: 'OK' });

  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

// Fungsi untuk mengirim produk digital via email
async function sendProduct(transaction) {
  try {
    // Konfigurasi email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: transaction.customer_details?.email,
      subject: '✅ Pembelian Magic Chess GO GO Guide Berhasil!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Terima Kasih atas Pembelian Anda!</h2>
          
          <p>Halo ${transaction.customer_details?.first_name},</p>
          
          <p>Pembayaran Anda untuk <strong>Magic Chess GO GO - Ultimate Guide</strong> telah berhasil dikonfirmasi.</p>
          
          <div style="background: #F3F4F6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Detail Pesanan:</h3>
            <p><strong>Order ID:</strong> ${transaction.order_id}</p>
            <p><strong>Jumlah:</strong> Rp ${parseInt(transaction.gross_amount).toLocaleString('id-ID')}</p>
            <p><strong>Status:</strong> Berhasil ✅</p>
          </div>
          
          <div style="background: #DBEAFE; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1E40AF;">📥 Download Produk Anda:</h3>
            <p>Klik tombol di bawah untuk mengunduh panduan lengkap:</p>
            <a href="${process.env.PRODUCT_DOWNLOAD_URL}" 
               style="display: inline-block; background: #4F46E5; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 0;">
              Download Guide Sekarang
            </a>
            <p style="font-size: 12px; color: #666; margin-top: 10px;">
              Link download: ${process.env.PRODUCT_DOWNLOAD_URL}
            </p>
          </div>
          
          <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>🎁 Bonus:</strong></p>
            <ul>
              <li>Video Tutorial Eksklusif</li>
              <li>Update Gratis Selamanya</li>
              <li>Akses Grup Komunitas (Coming Soon)</li>
            </ul>
          </div>
          
          <p>Jika ada pertanyaan, silakan hubungi kami:</p>
          <ul>
            <li>Email: support@magicchessguide.com</li>
            <li>WhatsApp: 08xx-xxxx-xxxx</li>
          </ul>
          
          <p style="margin-top: 30px;">Selamat belajar dan semoga cepat naik rank!</p>
          
          <p style="color: #666; font-size: 12px; margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px;">
            © 2026 Magic Chess GO GO Guide. All rights reserved.
          </p>
        </div>
      `
    };

    // Kirim email
    await transporter.sendMail(mailOptions);
    console.log('Product sent successfully to:', transaction.customer_details?.email);

  } catch (error) {
    console.error('Error sending product:', error);
    throw error;
  }
}