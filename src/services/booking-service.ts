
import { BaseApiService } from './base-api';
import { UIBooking, DatabaseBooking } from '@/types';
import { BookingDB, CreateBookingDTO } from '@/types/bookings';

/**
 * Service for handling booking-related API calls
 */
export class BookingService extends BaseApiService {
  /**
   * Get all bookings for a user
   */
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

  /**
   * Create a new booking
   */
  async createBooking(bookingData: CreateBookingDTO): Promise<UIBooking> {
    const { data, error } = await this.supabase
      .from('bookings')
      .insert([bookingData])
      .select(`
        *,
        tours:tour_id(*),
        accommodations:accommodation_id(*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
    
    return this.mapBookingFromDB(data as any);
  }

  /**
   * Cancel a booking
   */
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
      .select(`
        *,
        tours:tour_id(*),
        accommodations:accommodation_id(*)
      `)
      .single();
      
    if (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
    
    return this.mapBookingFromDB(data as any);
  }

  /**
   * Helper method to map database booking to application booking model
   */
  private mapBookingFromDB(bookingDB: any): UIBooking {
    const itemType = bookingDB.tour_id ? 'tour' as const : 
                    bookingDB.accommodation_id ? 'accommodation' as const : 
                    'package' as const;

    // Safely handle potentially null related objects
    const tours = bookingDB.tours || null;
    const accommodations = bookingDB.accommodations || null;

    // Get item name safely
    const itemName = 
      (tours && typeof tours === 'object' && tours.title) || 
      (accommodations && typeof accommodations === 'object' && accommodations.title) || 
      'Booking';

    return {
      id: bookingDB.id.toString(),
      user_id: bookingDB.user_id,
      user_name: 'User', // Default value
      user_email: '', // This would ideally come from user profiles
      item_type: itemType,
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
      tours: tours,
      accommodations: accommodations
    };
  }
}

export const bookingService = new BookingService();
