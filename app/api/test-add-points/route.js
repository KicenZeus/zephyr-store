import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const pointsToAdd = parseInt(searchParams.get('points') || '100');
    console.log('🧪 [TEST API GET] Starting test add points for:', userId);
    console.log('🧪 [TEST API GET] Points to add:', pointsToAdd);

    if (!userId) {
      return NextResponse.json({ error: 'userId required as query param' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // First get current points
    console.log('🧪 [TEST API GET] Fetching current profile...');
    const { data: currentProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, points')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('❌ [TEST API GET] Error fetching profile:', fetchError);
      return NextResponse.json({ error: fetchError }, { status: 500 });
    }

    const newPoints = (currentProfile.points || 0) + pointsToAdd;
    console.log('🧪 [TEST API GET] Current points:', currentProfile.points, 'New points:', newPoints);

    const { data, error } = await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('❌ [TEST API GET] Error updating points:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log('✅ [TEST API GET] Success!', data);
    return NextResponse.json({ success: true, newPoints, data, oldPoints: currentProfile.points });
  } catch (err) {
    console.error('❌ [TEST API GET] Uncaught error:', err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, pointsToAdd } = await request.json();
    console.log('🧪 [TEST API POST] Starting test add points for:', userId);
    console.log('🧪 [TEST API POST] Points to add:', pointsToAdd);

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // First get current points
    console.log('🧪 [TEST API POST] Fetching current profile...');
    const { data: currentProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, points')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('❌ [TEST API POST] Error fetching profile:', fetchError);
      return NextResponse.json({ error: fetchError }, { status: 500 });
    }

    const newPoints = (currentProfile.points || 0) + (pointsToAdd || 100);
    console.log('🧪 [TEST API POST] Current points:', currentProfile.points, 'New points:', newPoints);

    const { data, error } = await supabase
      .from('profiles')
      .update({ points: newPoints })
      .eq('id', userId)
      .select();

    if (error) {
      console.error('❌ [TEST API POST] Error updating points:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    console.log('✅ [TEST API POST] Success!', data);
    return NextResponse.json({ success: true, newPoints, data });
  } catch (err) {
    console.error('❌ [TEST API POST] Uncaught error:', err);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
