const midtransClient = require('midtrans-client');

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { customerName, customerEmail, customerPhone, itemName, price, productUrl } = req.body;

    // Inisialisasi Midtrans Snap
    let snap = new midtransClient.Snap({
      isProduction: false, // Ubah ke true untuk production
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    // Generate unique order ID
    const orderId = 'ORDER-' + Date.now();

    // Parameter transaksi
    let parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: price
      },
      credit_card: {
        secure: true
      },
      item_details: [{
        id: 'MAGIC-CHESS-GUIDE',
        price: price,
        quantity: 1,
        name: itemName
      }],
      customer_details: {
        first_name: customerName,
        email: customerEmail,
        phone: customerPhone
      },
      callbacks: {
        finish: `${process.env.BASE_URL}/thank-you`
      }
    };

    // Buat transaksi dan dapatkan Snap token
    const transaction = await snap.createTransaction(parameter);
    
    return res.status(200).json({
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      order_id: orderId
    });

  } catch (error) {
    console.error('Midtrans Error:', error);
    return res.status(500).json({ 
      error: 'Failed to create transaction',
      details: error.message 
    });
  }
}