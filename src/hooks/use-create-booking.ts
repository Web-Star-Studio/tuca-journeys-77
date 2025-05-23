
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { bookingService } from '@/services';
import { toast } from 'sonner';
import { CreateBookingDTO } from '@/types/bookings';

/**
 * Hook for creating a new booking
 * 
 * @returns Mutation for creating a booking
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (bookingData: CreateBookingDTO) => {
      return bookingService.createBooking(bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', user?.id] });
      toast.success('Reserva criada com sucesso');
    },
    onError: (error) => {
      console.error('Error creating booking:', error);
      toast.error('Erro ao criar reserva');
    }
  });
};
