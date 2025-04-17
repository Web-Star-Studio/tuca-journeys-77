
import React from "react";
import { useBookings } from "@/hooks/use-bookings";
import BookingRow from "./BookingRow";
import BookingsTableHeader from "./BookingsTableHeader";
import BookingEmptyState from "./BookingEmptyState";
import BookingLoadingState from "./BookingLoadingState";
import { Loader2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const BookingsTable = () => {
  const { bookings, isLoading, error } = useBookings();

  // Loading state
  if (isLoading) {
    return <BookingLoadingState />;
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mb-3" />
            <h3 className="text-lg font-medium mb-1">Erro ao carregar reservas</h3>
            <p className="text-gray-500 mb-4">
              Não foi possível carregar suas reservas neste momento. Tente novamente mais tarde.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!bookings || bookings.length === 0) {
    return <BookingEmptyState />;
  }

  // Data loaded successfully
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full rounded-lg border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <BookingsTableHeader />
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <BookingRow key={booking.id} booking={booking} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsTable;
