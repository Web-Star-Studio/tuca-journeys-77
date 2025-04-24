
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services';
import { Booking as UIBooking } from '@/types/bookings';
import { toast } from 'sonner';

/**
 * Hook to fetch user bookings
 * 
 * @returns List of user bookings and loading/error states
 */
export const useBookingsList = () => {
  const { user } = useAuth();
  
  const { 
    data: bookings = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['bookings', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      try {
        return await bookingService.getUserBookings(user.id);
      } catch (err) {
        console.error("Error fetching user bookings:", err);
        toast.error("Erro ao carregar suas reservas");
        return [];
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  return {
    bookings,
    isLoading,
    error,
  };
};
