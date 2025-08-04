export interface BusinessRelationship {
  id: string
  place_id: string
  place_name: string
  business_name: string
  contact_person: string
  contact_email?: string
  contact_phone?: string
  relationship_type: RelationshipType
  trust_level: TrustLevel
  connection_strength: ConnectionStrength
  established_date: string
  last_interaction: string
  status: RelationshipStatus
  description: string
  special_arrangements: SpecialArrangement[]
  referral_benefits: ReferralBenefit[]
  interaction_history: BusinessInteraction[]
  tags: string[]
  notes: string
  review_date?: string
  mutual_contacts: string[]
}

export interface SpecialArrangement {
  id: string
  type: ArrangementType
  description: string
  terms?: string
  expiry_date?: string
  usage_count: number
  max_usage?: number
  is_active: boolean
}

export interface ReferralBenefit {
  id: string
  type: BenefitType
  description: string
  discount_percentage?: number
  discount_amount?: number
  special_access?: string
  validity_period?: string
  conditions: string[]
  is_active: boolean
}

export interface BusinessInteraction {
  id: string
  date: string
  type: InteractionType
  description: string
  outcome: InteractionOutcome
  follow_up_required: boolean
  follow_up_date?: string
  notes?: string
  value_generated?: number
  referrals_made?: number
}

export interface BusinessConnection {
  business_a_id: string
  business_b_id: string
  connection_type: 'supplier' | 'partner' | 'collaborator' | 'competitor' | 'referral_source'
  strength: number // 1-10
  mutual_benefit: boolean
  description: string
  established_date: string
}

export interface RelationshipMetrics {
  total_relationships: number
  active_relationships: number
  relationship_by_type: Record<RelationshipType, number>
  trust_level_distribution: Record<TrustLevel, number>
  referrals_made: number
  referrals_received: number
  value_generated: number
  relationship_growth_rate: number
  average_relationship_age: number
}

export interface ReferralTracking {
  id: string
  referred_by: string
  referred_to: string
  business_id: string
  referral_date: string
  status: ReferralStatus
  outcome?: ReferralOutcome
  value_generated?: number
  follow_up_date?: string
  notes: string
}

export interface NetworkMap {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
  clusters: NetworkCluster[]
}

export interface NetworkNode {
  id: string
  name: string
  type: 'person' | 'business' | 'place'
  category?: string
  influence_score: number
  connection_count: number
  position: { x: number; y: number }
  size: number
  color: string
}

export interface NetworkEdge {
  source: string
  target: string
  strength: number
  type: string
  bidirectional: boolean
}

export interface NetworkCluster {
  id: string
  name: string
  nodes: string[]
  center: { x: number; y: number }
  theme: string
}

// Enums
export type RelationshipType = 
  | 'mention_my_name'
  | 'personal_friend'
  | 'regular_customer'
  | 'business_partner'
  | 'supplier'
  | 'referral_source'
  | 'collaborator'
  | 'community_connection'

export type TrustLevel = 'high' | 'medium' | 'low' | 'verified' | 'new'

export type ConnectionStrength = 'strong' | 'moderate' | 'weak' | 'dormant'

export type RelationshipStatus = 'active' | 'inactive' | 'pending' | 'ended'

export type ArrangementType = 
  | 'discount'
  | 'priority_service'
  | 'special_access'
  | 'bulk_pricing'
  | 'extended_credit'
  | 'custom_service'
  | 'exclusive_offering'

export type BenefitType = 
  | 'percentage_discount'
  | 'fixed_discount'
  | 'free_service'
  | 'upgrade'
  | 'priority_booking'
  | 'special_menu'
  | 'exclusive_access'

export type InteractionType = 
  | 'visit'
  | 'referral'
  | 'recommendation'
  | 'collaboration'
  | 'event'
  | 'meeting'
  | 'phone_call'
  | 'email'
  | 'social_media'

export type InteractionOutcome = 
  | 'positive'
  | 'neutral'
  | 'negative'
  | 'pending'
  | 'follow_up_required'

export type ReferralStatus = 
  | 'pending'
  | 'contacted'
  | 'visited'
  | 'converted'
  | 'declined'
  | 'expired'

export type ReferralOutcome = 
  | 'successful'
  | 'unsuccessful'
  | 'partial'
  | 'ongoing'

// Analytics and Insights
export interface RelationshipInsight {
  type: 'opportunity' | 'risk' | 'growth' | 'maintenance'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  action_items: string[]
  impact_score: number
  effort_required: 'low' | 'medium' | 'high'
  timeline: string
  related_relationships: string[]
}

export interface BusinessOpportunity {
  id: string
  title: string
  description: string
  opportunity_type: 'collaboration' | 'referral' | 'partnership' | 'expansion'
  businesses_involved: string[]
  potential_value: number
  probability: number
  timeline: string
  requirements: string[]
  next_steps: string[]
  status: 'identified' | 'exploring' | 'negotiating' | 'active' | 'completed' | 'abandoned'
}

export interface RelationshipAlert {
  id: string
  type: 'maintenance' | 'opportunity' | 'risk' | 'follow_up'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  business_id?: string
  due_date?: string
  is_read: boolean
  created_at: string
  action_required: boolean
  action_url?: string
}