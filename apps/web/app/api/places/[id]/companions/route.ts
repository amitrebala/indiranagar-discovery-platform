import { NextRequest, NextResponse } from 'next/server';
import { CompanionEngine } from '@/lib/services/companion-engine';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const timeAvailable = searchParams.get('time');
    const mood = searchParams.get('mood');
    const budget = searchParams.get('budget') as 'low' | 'medium' | 'high' | null;
    
    const engine = new CompanionEngine();
    const companions = await engine.findCompanions(params.id, {
      time_available: timeAvailable ? parseInt(timeAvailable) : undefined,
      mood: mood || undefined,
      budget: budget || undefined
    });
    
    return NextResponse.json(companions);
  } catch (error) {
    console.error('Error finding companions:', error);
    return NextResponse.json(
      { error: 'Failed to find companion activities' },
      { status: 500 }
    );
  }
}

// POST: Compute and store companion activities for a place
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const engine = new CompanionEngine();
    await engine.computeAndStoreCompanions(params.id);
    
    return NextResponse.json({ 
      message: 'Companion activities computed and stored successfully' 
    });
  } catch (error) {
    console.error('Error computing companions:', error);
    return NextResponse.json(
      { error: 'Failed to compute companion activities' },
      { status: 500 }
    );
  }
}