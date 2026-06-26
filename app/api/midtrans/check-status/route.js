
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import midtransClient from 'midtrans-client';

const core = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }

    const statusResponse = await core.transaction.status(orderId);

    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;

    let newStatus = 'pending';
    if (transactionStatus === 'capture' && fraudStatus === 'accept') {
      newStatus = 'success';
    } else if (transactionStatus === 'settlement') {
      newStatus = 'success';
    } else if (transactionStatus === 'deny' || transactionStatus === 'cancel' || transactionStatus === 'expire') {
      newStatus = 'failed';
    }

    if (newStatus !== 'pending') {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from('transactions')
        .update({ status: newStatus, payment_method: 'Midtrans' })
        .eq('id', orderId)
        .select();

      if (error) throw error;
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      midtransStatus: transactionStatus
    });
  } catch (error) {
    console.error('Check status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check status' },
      { status: 500 }
    );
  }
}
