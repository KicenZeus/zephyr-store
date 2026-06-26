import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

// Inisialisasi Midtrans Snap Client (Sandbox Mode)
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { orderId, amount, gameName, itemName, customerName, customerEmail } = body;

    // Parameter untuk transaksi Midtrans
    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      item_details: [
        {
          id: orderId,
          price: amount,
          quantity: 1,
          name: `${gameName} - ${itemName}`,
        },
      ],
      customer_details: {
        first_name: customerName,
        email: customerEmail,
      },
    };

    // Buat transaksi di Midtrans
    const transaction = await snap.createTransaction(parameter);

    // Balikin token dan redirect URL
    return NextResponse.json({
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    });
  } catch (error) {
    console.error('Midtrans error:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
