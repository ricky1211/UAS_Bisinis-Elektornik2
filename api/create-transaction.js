import midtransClient from 'midtrans-client';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { customerName, customerEmail, customerPhone, itemName } = req.body;

    const snap = new midtransClient.Snap({
      isProduction: false, // Set true jika sudah live
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    });

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${Date.now()}`,
        gross_amount: 10000 // Harga dipaksa ke 10.000 di backend
      },
      item_details: [{ name: itemName, price: 10000, quantity: 1 }],
      customer_details: {
        first_name: customerName,
        email: customerEmail,
        phone: customerPhone
      }
    };

    const transaction = await snap.createTransaction(parameter);
    res.status(200).json({ token: transaction.token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}