import { supabase } from '@/lib/supabase';
import { Tour, Accommodation, Booking, UserProfile } from '@/types/database';
import { Package } from '@/data/types/packageTypes';
import { Booking as UIBooking } from '@/types/bookings';

// Tours API
export const getToursFromDB = async () => {
  console.log("Fetching all tours");
  const { data, error } = await supabase
    .from('tours')
    .select('*');
  
  if (error) {
    console.error('Error fetching tours:', error);
    throw error;
  }
  
  return data as Tour[];
};

export const getTourByIdFromDB = async (id: number) => {
  console.log(`Fetching tour with ID: ${id}`);
  const { data, error } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching tour ${id}:`, error);
    throw error;
  }
  
  return data as Tour;
};

// Packages API
export const getPackagesFromDB = async (category?: string) => {
  // For packages we'll use the static data for now
  // This is a placeholder for future database integration
  return [] as Package[];
};

export const getPackageByIdFromDB = async (id: number) => {
  // For packages we'll use the static data for now
  // This is a placeholder for future database integration
  return {} as Package;
};

// Accommodations API
export const getAccommodationsFromDB = async () => {
  console.log("Fetching all accommodations");
  const { data, error } = await supabase
    .from('accommodations')
    .select('*');
  
  if (error) {
    console.error('Error fetching accommodations:', error);
    throw error;
  }
  
  return data as Accommodation[];
};

export const getAccommodationByIdFromDB = async (id: number) => {
  console.log(`Fetching accommodation with ID: ${id}`);
  const { data, error } = await supabase
    .from('accommodations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching accommodation ${id}:`, error);
    throw error;
  }
  
  return data as Accommodation;
};

// Bookings API
export const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
  console.log("Creating booking:", booking);
  
  // Create a booking object that matches the database schema
  // Map number_of_guests to guests as required by the database
  const dbBooking = {
    user_id: booking.user_id,
    tour_id: booking.tour_id,
    accommodation_id: booking.accommodation_id,
    start_date: booking.start_date,
    end_date: booking.end_date,
    guests: booking.number_of_guests, // Map from number_of_guests to guests
    total_price: booking.total_price,
    status: booking.status as 'confirmed' | 'pending' | 'cancelled',
    payment_status: booking.status === 'confirmed' ? 'paid' : 'pending',
    payment_method: booking.payment_method || null,
    special_requests: booking.special_requests || null
  };
  
  const { data, error } = await supabase
    .from('bookings')
    .insert([dbBooking])
    .select()
    .single();
  
  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
  
  // Map the response back to the Booking interface expected by the app
  const responseBooking: Booking = {
    id: data.id.toString(),
    user_id: data.user_id,
    tour_id: data.tour_id,
    accommodation_id: data.accommodation_id,
    start_date: data.start_date,
    end_date: data.end_date,
    number_of_guests: data.guests, // Map from guests to number_of_guests
    total_price: data.total_price,
    status: data.status as 'confirmed' | 'pending' | 'cancelled',
    notes: data.special_requests || undefined,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
  
  return responseBooking;
};

export const getUserBookings = async (userId: string): Promise<UIBooking[]> => {
  console.log(`Fetching bookings for user: ${userId}`);
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      tours:tour_id(id, title, description, short_description, image_url, category, price, duration),
      accommodations:accommodation_id(id, title, description, short_description, image_url, category, price_per_night)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
  
  // Map the database bookings to the Booking interface
  const bookings = (data || []).map(dbBooking => {
    // Safely handle potentially null or error relations
    const tourData = dbBooking.tours || null;
    const accommodationData = dbBooking.accommodations || null;
    
    // Check if the relations returned errors or are null
    const hasTourError = tourData && typeof tourData === 'object' && 'error' in tourData;
    const hasAccommodationError = accommodationData && typeof accommodationData === 'object' && 'error' in accommodationData;
    
    // Determine item type and name safely
    let itemType: 'tour' | 'accommodation' | 'package' = 'package';
    let itemName = 'Booking';
    
    if (dbBooking.tour_id && tourData && !hasTourError) {
      itemType = 'tour';
      // Using optional chaining and nullish coalescing to safely access title
      itemName = (tourData as any)?.title || 'Tour';
    } else if (dbBooking.accommodation_id && accommodationData && !hasAccommodationError) {
      itemType = 'accommodation';
      // Using optional chaining and nullish coalescing to safely access title
      itemName = (accommodationData as any)?.title || 'Accommodation';
    }
    
    return {
      id: dbBooking.id.toString(),
      user_id: dbBooking.user_id,
      user_name: 'User', // Default value
      user_email: '', // This would ideally come from user profiles
      item_type: itemType,
      item_name: itemName,
      start_date: dbBooking.start_date,
      end_date: dbBooking.end_date,
      guests: dbBooking.guests,
      total_price: dbBooking.total_price,
      status: dbBooking.status as 'confirmed' | 'pending' | 'cancelled',
      payment_status: dbBooking.payment_status as 'paid' | 'pending' | 'refunded',
      payment_method: dbBooking.payment_method,
      special_requests: dbBooking.special_requests,
      created_at: dbBooking.created_at,
      updated_at: dbBooking.updated_at,
      tour_id: dbBooking.tour_id,
      accommodation_id: dbBooking.accommodation_id,
      tours: hasTourError ? null : tourData,
      accommodations: hasAccommodationError ? null : accommodationData
    } as UIBooking;
  });
  
  return bookings;
};

// User profiles
export const getUserProfile = async (userId: string) => {
  console.log(`Fetching profile for user: ${userId}`);
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is the error for "no rows returned"
    console.error('Error fetching user profile:', error);
    throw error;
  }
  
  return data as UserProfile | null;
};

export const createOrUpdateUserProfile = async (profile: Partial<UserProfile> & { id: string }) => {
  console.log("Creating/updating user profile:", profile);
  // Check if profile exists
  const existingProfile = await getUserProfile(profile.id);
  
  if (existingProfile) {
    // Update
    console.log("Existing profile found, updating");
    const { data, error } = await supabase
      .from('user_profiles')
      .update(profile)
      .eq('id', profile.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
    
    return data as UserProfile;
  } else {
    // Create
    console.log("No profile found, creating new profile");
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([profile])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
    
    return data as UserProfile;
  }
};

// Get user roles
export const getUserRoles = async (userId: string) => {
  console.log(`Fetching roles for user: ${userId}`);
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching user roles:', error);
    throw error;
  }
  
  return data.map(item => item.role);
};

// Check if user has specific role
export const hasRole = async (userId: string, roleName: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const roles = await getUserRoles(userId);
    return roles.includes(roleName);
  } catch (error) {
    console.error('Error checking user role:', error);
    return false;
  }
};
