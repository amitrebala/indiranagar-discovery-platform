import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedMockEvents() {
  console.log('🌱 Seeding mock events for testing...\n');
  
  // Mock events data that would be in the system
  const mockEvents = [
    {
      id: crypto.randomUUID(),
      title: 'Toit Brewery: Live Music Night',
      description: 'Enjoy craft beers with live acoustic performances',
      category: 'nightlife',
      subcategory: 'live-music',
      tags: ['music', 'brewery', 'craft-beer', 'live-performance'],
      start_time: new Date('2025-01-10T19:00:00').toISOString(),
      end_time: new Date('2025-01-10T23:00:00').toISOString(),
      venue_name: 'Toit Brewery',
      venue_address: '298, 100 Feet Road, Indiranagar',
      latitude: 12.9783,
      longitude: 77.6408,
      organizer_name: 'Toit Brewery',
      organizer_type: 'business',
      external_url: 'https://toit.in',
      cost_type: 'free',
      capacity: 150,
      quality_score: 0.92,
      verification_status: 'verified',
      moderation_status: 'approved',
      view_count: 245,
      rsvp_count: 67,
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: 'Weekend Farmer\'s Market',
      description: 'Fresh organic produce, artisanal products, and local crafts',
      category: 'shopping',
      subcategory: 'market',
      tags: ['organic', 'farmers-market', 'local', 'sustainable'],
      start_time: new Date('2025-01-11T07:00:00').toISOString(),
      end_time: new Date('2025-01-11T13:00:00').toISOString(),
      venue_name: 'Indiranagar Park',
      venue_address: 'HAL 2nd Stage, Indiranagar',
      latitude: 12.9716,
      longitude: 77.6411,
      organizer_name: 'Indiranagar Residents Association',
      organizer_type: 'community',
      cost_type: 'free',
      quality_score: 0.88,
      verification_status: 'verified',
      moderation_status: 'approved',
      view_count: 532,
      rsvp_count: 125,
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: 'Glen\'s Bakehouse: Sourdough Workshop',
      description: 'Learn the art of sourdough bread making from expert bakers',
      category: 'workshop',
      subcategory: 'culinary',
      tags: ['workshop', 'baking', 'sourdough', 'hands-on'],
      start_time: new Date('2025-01-12T10:00:00').toISOString(),
      end_time: new Date('2025-01-12T14:00:00').toISOString(),
      venue_name: "Glen's Bakehouse",
      venue_address: '606, 12th Main, Indiranagar',
      latitude: 12.9721,
      longitude: 77.6367,
      organizer_name: "Glen's Bakehouse",
      organizer_type: 'business',
      external_url: 'https://glensbakehouse.com',
      ticket_url: 'https://glensbakehouse.com/workshop',
      cost_type: 'paid',
      price_range: {
        min: 2500,
        max: 2500,
        currency: '₹'
      },
      capacity: 20,
      registration_required: true,
      quality_score: 0.95,
      verification_status: 'official',
      moderation_status: 'approved',
      view_count: 189,
      rsvp_count: 18,
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: 'Indiranagar Social: Comedy Night',
      description: 'Stand-up comedy featuring local and national comedians',
      category: 'entertainment',
      subcategory: 'comedy',
      tags: ['comedy', 'stand-up', 'entertainment', 'night-out'],
      start_time: new Date('2025-01-10T20:00:00').toISOString(),
      end_time: new Date('2025-01-10T22:30:00').toISOString(),
      venue_name: 'The Humming Tree',
      venue_address: '949, 12th Main, Indiranagar',
      latitude: 12.9772,
      longitude: 77.6395,
      organizer_name: 'The Humming Tree',
      organizer_type: 'business',
      ticket_url: 'https://insider.in/humming-tree',
      cost_type: 'paid',
      price_range: {
        min: 500,
        max: 800,
        currency: '₹'
      },
      capacity: 100,
      registration_required: true,
      quality_score: 0.90,
      verification_status: 'verified',
      moderation_status: 'approved',
      view_count: 412,
      rsvp_count: 76,
      is_active: true
    },
    {
      id: crypto.randomUUID(),
      title: 'Morning Yoga at Cubbon Park',
      description: 'Free community yoga session for all skill levels',
      category: 'wellness',
      subcategory: 'yoga',
      tags: ['yoga', 'fitness', 'outdoor', 'free', 'community'],
      start_time: new Date('2025-01-11T06:30:00').toISOString(),
      end_time: new Date('2025-01-11T07:30:00').toISOString(),
      venue_name: 'Cubbon Park',
      venue_address: 'Near Indiranagar Metro Station',
      latitude: 12.9763,
      longitude: 77.6425,
      organizer_name: 'Bangalore Yoga Community',
      organizer_type: 'community',
      cost_type: 'free',
      quality_score: 0.85,
      verification_status: 'verified',
      moderation_status: 'approved',
      view_count: 678,
      rsvp_count: 234,
      is_active: true
    }
  ];
  
  // Try to insert mock events
  console.log('Attempting to insert mock events...');
  for (const event of mockEvents) {
    const { error } = await supabase
      .from('discovered_events')
      .insert(event);
    
    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Tables not yet created. Please run the migration first.');
        console.log('\n📋 Mock events prepared for when tables are ready:');
        console.log(mockEvents.map(e => `  - ${e.title}`).join('\n'));
        return false;
      } else {
        console.error(`Error inserting "${event.title}":`, error.message);
      }
    } else {
      console.log(`✅ Added: ${event.title}`);
    }
  }
  
  // Also add mock place status
  const mockPlaceStatus = [
    {
      id: crypto.randomUUID(),
      place_id: crypto.randomUUID(),
      is_open: true,
      current_capacity: 'busy',
      wait_time_minutes: 20,
      special_status: 'Happy Hour 5-7 PM',
      source: 'google',
      confidence: 0.9,
      valid_until: new Date(Date.now() + 7200000).toISOString()
    }
  ];
  
  console.log('\nAttempting to add place live status...');
  const { error: statusError } = await supabase
    .from('place_live_status')
    .insert(mockPlaceStatus);
  
  if (statusError && statusError.code !== '42P01') {
    console.error('Error with place status:', statusError.message);
  } else if (!statusError) {
    console.log('✅ Added mock place live status');
  }
  
  return true;
}

async function main() {
  const success = await seedMockEvents();
  
  if (success) {
    console.log('\n🎉 Mock events seeded successfully!');
    console.log('Visit http://localhost:3000/events to see them');
  } else {
    console.log('\n⚠️  Please run the migration first, then run this script again');
  }
}

main().catch(console.error);