
export interface SignUpFormData {
  email: string;
  password: string;
  name: string;
}

export interface TravelParty {
  usually_travel_with: string[];
  family_members: number;
  children_ages: number[];
  typical_group_size: number;
}

export interface TravelPreferences {
  travel_style: 'leisure' | 'adventure' | 'culture' | 'luxury' | 'budget' | 'family' | 'business';
  preferred_seasons: string[];
  average_trip_duration: string;
  accommodation_types: string[];
  budget_range: 'economy' | 'moderate' | 'premium' | 'luxury';
  dietary_restrictions: string[];
  accessibility_requirements: string[];
}

export interface ActivityPreferences {
  interests: string[];
  activity_level: 'low' | 'moderate' | 'high' | 'extreme';
  preferred_group_size: string;
  special_interests: string[];
}

export interface CommunicationPreferences {
  preferred_language: string;
  contact_method: string;
  notification_preferences: {
    newsletter: boolean;
    deals: boolean;
    trip_reminders: boolean;
    travel_tips: boolean;
  };
}

export interface UserPreferences {
  travel_party: TravelParty;
  travel_preferences: TravelPreferences;
  activity_preferences: ActivityPreferences;
  communication_preferences: CommunicationPreferences;
}
