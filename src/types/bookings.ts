
import { Tour, Accommodation } from './database';

export interface Booking {
  id: string;
  user_id?: string;
  user_name: string;
  user_email: string;
  item_type: 'tour' | 'accommodation' | 'package';
  item_name: string;
  start_date: string;
  end_date: string;
  guests: number;
  total_price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'refunded';
  payment_method?: string | null;
  special_requests?: string | null;
  created_at: string;
  updated_at?: string;
  tour_id?: number | null;
  accommodation_id?: number | null;
  tours?: Tour | null;
  accommodations?: Accommodation | null;
}

export interface BookingDB {
  id: number;
  user_id: string;
  tour_id?: number | null;
  accommodation_id?: number | null;
  start_date: string;
  end_date: string;
  guests: number;
  total_price: number;
  status: string;
  payment_status: string;
  payment_method?: string | null;
  special_requests?: string | null;
  created_at: string;
  updated_at: string;
  tours?: any;
  accommodations?: any;
}

export interface CreateBookingDTO {
  user_id: string;
  tour_id?: number | null;
  accommodation_id?: number | null;
  start_date: string;
  end_date: string;
  guests: number;
  total_price: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  payment_status: 'paid' | 'pending' | 'refunded';
  payment_method?: string | null;
  special_requests?: string | null;
}

// Define DatabaseBooking as an alias of BookingDB for services using this name
export type DatabaseBooking = BookingDB;
