/**
 * Integration layer for Foodie Adventure MCP Server
 * Connects the MCP server with the Indiranagar Discovery Platform
 */

export interface FoodieMCPResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export class FoodieAdventureIntegration {
  private static instance: FoodieAdventureIntegration;
  private baseUrl: string;

  constructor() {
    // Use the deployed Vercel API or fallback to local API
    this.baseUrl = process.env.NEXT_PUBLIC_FOODIE_API_URL || 
                   'https://foodie-adventure-fqr34johx-amit-rebalas-projects.vercel.app' ||
                   '';
  }

  static getInstance(): FoodieAdventureIntegration {
    if (!FoodieAdventureIntegration.instance) {
      FoodieAdventureIntegration.instance = new FoodieAdventureIntegration();
    }
    return FoodieAdventureIntegration.instance;
  }

  async generateChallenge(params: {
    difficulty: 'easy' | 'medium' | 'hard' | 'legendary';
    timeLimit?: string;
    dietaryPreferences?: string[];
    groupSize?: number;
  }): Promise<FoodieMCPResponse> {
    return this.callAPI('/api/challenge', {
      difficulty: params.difficulty,
      time_limit: params.timeLimit,
      dietary_preferences: params.dietaryPreferences,
      group_size: params.groupSize,
    });
  }

  async createFoodCrawl(params: {
    theme: string;
    budget?: number;
    budgetPerPerson?: number;
    duration?: string;
    durationHours?: number;
    groupSize?: number;
    startLocation?: string;
  }): Promise<FoodieMCPResponse> {
    return this.callAPI('/api/food-crawl', {
      theme: params.theme,
      budget: params.budget,
      budget_per_person: params.budgetPerPerson,
      duration: params.duration,
      duration_hours: params.durationHours,
      group_size: params.groupSize,
      start_location: params.startLocation,
    });
  }

  async analyzeFlavorProfile(params: {
    likedPlaces: string[];
    favoriteDishes?: string[];
    spiceTolerance?: string;
    adventureLevel?: string;
  }): Promise<FoodieMCPResponse> {
    return this.callAPI('/api/flavor-profile', {
      liked_places: params.likedPlaces,
      favorite_dishes: params.favoriteDishes,
      spice_tolerance: params.spiceTolerance,
      adventure_level: params.adventureLevel,
    });
  }

  async findBudgetMeal(params: {
    budgetTotal: number;
    peopleCount: number;
    mealType?: string;
    includeDrinks?: boolean;
    cuisinePreference?: string;
  }): Promise<FoodieMCPResponse> {
    return this.callAPI('/api/budget-meal', {
      budget_total: params.budgetTotal,
      people_count: params.peopleCount,
      meal_type: params.mealType,
      include_drinks: params.includeDrinks,
      cuisine_preference: params.cuisinePreference,
    });
  }

  async getFoodStory(params: {
    placeName: string;
    storyType?: string;
  }): Promise<FoodieMCPResponse> {
    return this.callAPI('/api/food-story', {
      place_name: params.placeName,
      story_type: params.storyType,
    });
  }

  async startSocialQuest(params: {
    questType: 'race' | 'bingo' | 'scavenger_hunt' | 'progressive_dinner';
    participantCount: number;
    competitionLevel?: string;
    prizes?: string[];
  }): Promise<FoodieMCPResponse> {
    return this.callAPI('/api/social-quest', {
      quest_type: params.questType,
      participant_count: params.participantCount,
      competition_level: params.competitionLevel,
      prizes: params.prizes,
    });
  }

  private async callAPI(endpoint: string, params: any): Promise<FoodieMCPResponse> {
    try {
      const url = this.baseUrl ? `${this.baseUrl}${endpoint}` : `/api/mcp/foodie-adventure${endpoint.replace('/api', '')}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: data.success || true,
        data: data.data || data,
      };
    } catch (error) {
      console.error(`Error calling API ${endpoint}:`, error);
      
      // Fallback to local API route if remote API fails
      if (this.baseUrl) {
        try {
          const fallbackUrl = `/api/mcp/foodie-adventure${endpoint.replace('/api', '')}`;
          const response = await fetch(fallbackUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(params),
          });

          if (response.ok) {
            const data = await response.json();
            return {
              success: data.success || true,
              data: data.data || data,
            };
          }
        } catch (fallbackError) {
          console.error('Fallback API also failed:', fallbackError);
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Utility methods for common integrations

  /**
   * Get personalized challenge suggestions based on user's visited places
   */
  async getPersonalizedChallenges(userId: string): Promise<any[]> {
    // This would integrate with your user system to get their place history
    // For now, this is a placeholder structure
    const userPlaces = await this.getUserVisitedPlaces(userId);
    
    const suggestions = [];
    
    // Generate different difficulty challenges
    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    
    for (const difficulty of difficulties) {
      const response = await this.generateChallenge({
        difficulty,
        groupSize: 1,
      });
      
      if (response.success) {
        suggestions.push(response.data);
      }
    }
    
    return suggestions;
  }

  /**
   * Create a challenge from a specific place list
   */
  async createPlaceBasedChallenge(places: string[], difficulty: 'easy' | 'medium' | 'hard' | 'legendary'): Promise<FoodieMCPResponse> {
    // Use the places to inform flavor profile analysis
    const profileResponse = await this.analyzeFlavorProfile({
      likedPlaces: places,
    });

    if (!profileResponse.success) {
      return profileResponse;
    }

    // Generate a challenge based on the profile
    return this.generateChallenge({
      difficulty,
      groupSize: 1,
    });
  }

  /**
   * Get budget-friendly options for a specific area
   */
  async getBudgetOptionsForArea(area: string, budget: number, peopleCount: number): Promise<FoodieMCPResponse> {
    return this.findBudgetMeal({
      budgetTotal: budget,
      peopleCount,
      // The MCP server will filter based on area through the existing places database
    });
  }

  /**
   * Create a themed food crawl for events
   */
  async createEventFoodCrawl(eventType: string, attendeeCount: number, budget: number): Promise<FoodieMCPResponse> {
    const themes = {
      birthday: 'dessert trail',
      office_outing: 'lunch crawl',
      date_night: 'romantic dinner progression',
      weekend_fun: 'street food safari',
      celebration: 'craft beer journey',
    };

    const theme = themes[eventType as keyof typeof themes] || 'general food exploration';

    return this.createFoodCrawl({
      theme,
      budgetPerPerson: Math.floor(budget / attendeeCount),
      durationHours: 4,
      startLocation: '100 Feet Road', // Default start location
    });
  }

  // Placeholder method - would integrate with your user system
  private async getUserVisitedPlaces(userId: string): Promise<string[]> {
    // This would query your user_places or similar table
    // For now, return empty array
    return [];
  }

  /**
   * Integration with your existing place data
   * This method shows how to enhance places with MCP-generated content
   */
  async enhancePlaceWithStory(placeName: string): Promise<{
    place: any;
    story?: string;
    recommendations?: any;
  }> {
    // Get the story
    const storyResponse = await this.getFoodStory({
      placeName,
      storyType: 'origin',
    });

    // Get flavor-based recommendations if we have user context
    const result: any = {
      place: { name: placeName },
    };

    if (storyResponse.success) {
      result.story = storyResponse.data;
    }

    return result;
  }

  /**
   * Create social quest for community events
   */
  async createCommunityQuest(eventId: string, participants: number): Promise<FoodieMCPResponse> {
    const questTypes: Array<'race' | 'bingo' | 'scavenger_hunt' | 'progressive_dinner'> = [
      'bingo', 'scavenger_hunt', 'progressive_dinner'
    ];

    const questType = questTypes[Math.floor(Math.random() * questTypes.length)];

    return this.startSocialQuest({
      questType,
      participantCount: participants,
      competitionLevel: 'friendly',
      prizes: [
        'Community champion badge',
        'Featured spot in next newsletter',
        'VIP access to next community event',
      ],
    });
  }
}

// Export singleton instance for easy use
export const foodieIntegration = FoodieAdventureIntegration.getInstance();