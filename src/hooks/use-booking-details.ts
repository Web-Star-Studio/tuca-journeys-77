
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services';
import { Booking as UIBooking } from '@/types/bookings';
import { toast } from 'sonner';

/**
 * Hook to fetch details for a specific booking
 * 
 * @param id - Booking ID to fetch
 * @returns Booking details and loading/error states
 */
export const useBookingDetails = (id: string | undefined) => {
  const { user } = useAuth();
  
  const { 
    data: booking, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      if (!user?.id || !id) return null;
      
      try {
        const bookings = await bookingService.getUserBookings(user.id);
        return bookings.find(booking => booking.id === id) || null;
      } catch (err) {
        console.error(`Error fetching booking ${id}:`, err);
        toast.error("Erro ao carregar detalhes da reserva");
        return null;
      }
    },
    enabled: !!user?.id && !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  return {
    booking,
    isLoading,
    error,
  };
};
