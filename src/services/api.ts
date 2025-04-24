
import { supabase } from '@/lib/supabase';
import { Booking as UIBooking } from '@/types/bookings';
import { CreateBookingDTO } from '@/types/bookings';
import { Tour, Accommodation, UserProfile } from '@/types/database';
import { Package } from '@/data/types/packageTypes';

/**
 * @deprecated This file is deprecated. Please use the individual service modules:
 * - import { tourService } from '@/services';
 * - import { accommodationService } from '@/services';
 * - import { bookingService } from '@/services';
 * - import { userService } from '@/services';
 * 
 * Or import the unified API from the index file:
 * - import { apiService } from '@/services';
 */

/**
 * Base API service for interacting with Supabase
 * @deprecated Use individual service modules instead
 */
class ApiService {
  // Add supabase instance
  protected supabase = supabase;
  
  // Tours
  async getTours(): Promise<Tour[]> {
    const { data, error } = await this.supabase
      .from('tours')
      .select('*');
    
    if (error) {
      console.error('Error fetching tours:', error);
      throw error;
    }
    
    return data;
  }

  async getTourById(id: number): Promise<Tour> {
    const { data, error } = await this.supabase
      .from('tours')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching tour ${id}:`, error);
      throw error;
    }
    
    return data;
  }

  // Accommodations
  async getAccommodations(): Promise<Accommodation[]> {
    const { data, error } = await this.supabase
      .from('accommodations')
      .select('*');
    
    if (error) {
      console.error('Error fetching accommodations:', error);
      throw error;
    }
    
    return data;
  }

  async getAccommodationById(id: number): Promise<Accommodation> {
    const { data, error } = await this.supabase
      .from('accommodations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching accommodation ${id}:`, error);
      throw error;
    }
    
    return data;
  }

  // Bookings
  async getUserBookings(userId: string): Promise<UIBooking[]> {
    const { data, error } = await this.supabase
      .from('bookings')
      .select(`
        *,
        tours:tour_id(*),
        accommodations:accommodation_id(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
    
    // Transform database bookings into the application booking model
    return (data || []).map((bookingDB: any) => this.mapBookingFromDB(bookingDB));
  }

  async createBooking(bookingData: CreateBookingDTO): Promise<UIBooking> {
    const { data, error } = await this.supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
    
    return this.mapBookingFromDB(data as any);
  }

  async cancelBooking(bookingId: string, userId: string): Promise<UIBooking> {
    // Convert bookingId to number since the database expects a number
    const numericBookingId = parseInt(bookingId, 10);
    
    if (isNaN(numericBookingId)) {
      throw new Error('Invalid booking ID format');
    }
    
    const { data, error } = await this.supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', numericBookingId)
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
    
    return this.mapBookingFromDB(data as any);
  }

  // Helper method to map database booking to application booking model
  private mapBookingFromDB(bookingDB: any): UIBooking {
    // Safely handle potentially null related objects
    const tours = bookingDB.tours || null;
    const accommodations = bookingDB.accommodations || null;

    // Check for errors in related data
    const hasTourError = tours && typeof tours === 'object' && 'error' in tours;
    const hasAccommodationError = accommodations && typeof accommodations === 'object' && 'error' in accommodations;

    // Get item name safely with optional chaining
    const itemName = 
      (tours && typeof tours === 'object' && !hasTourError && tours?.title) || 
      (accommodations && typeof accommodations === 'object' && !hasAccommodationError && accommodations?.title) || 
      'Booking';

    return {
      id: bookingDB.id.toString(),
      user_id: bookingDB.user_id,
      user_name: 'User', // Default value
      user_email: '',  // This would ideally come from user profiles
      item_type: bookingDB.tour_id ? 'tour' as const : 
                bookingDB.accommodation_id ? 'accommodation' as const : 
                'package' as const,
      item_name: itemName,
      start_date: bookingDB.start_date,
      end_date: bookingDB.end_date,
      guests: bookingDB.guests,
      total_price: bookingDB.total_price,
      status: bookingDB.status as 'confirmed' | 'pending' | 'cancelled',
      payment_status: bookingDB.payment_status as 'paid' | 'pending' | 'refunded',
      payment_method: bookingDB.payment_method,
      special_requests: bookingDB.special_requests,
      created_at: bookingDB.created_at,
      updated_at: bookingDB.updated_at,
      tour_id: bookingDB.tour_id,
      accommodation_id: bookingDB.accommodation_id,
      tours: hasTourError ? null : tours,
      accommodations: hasAccommodationError ? null : accommodations
    };
  }

  // User profiles
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is the error for "no rows returned"
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    return data || null;
  }

  async createOrUpdateUserProfile(profile: Partial<UserProfile> & { id: string }): Promise<UserProfile> {
    // Check if profile exists
    try {
      const existingProfile = await this.getUserProfile(profile.id);
      
      if (existingProfile) {
        // Update
        const { data, error } = await this.supabase
          .from('user_profiles')
          .update(profile)
          .eq('id', profile.id)
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      } else {
        // Create
        const { data, error } = await this.supabase
          .from('user_profiles')
          .insert([profile])
          .select()
          .single();
        
        if (error) {
          throw error;
        }
        
        return data;
      }
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  }

  // User roles
  async getUserRoles(userId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
    
    return data.map(item => item.role);
  }

  async hasRole(userId: string, roleName: string): Promise<boolean> {
    if (!userId) return false;
    
    try {
      const roles = await this.getUserRoles(userId);
      return roles.includes(roleName);
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }
}

export const apiService = new ApiService();
