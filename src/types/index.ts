
// Re-export all types from this central file
export * from './database';
export * from './event';
export * from './partner';
export type { Booking as BookingDB } from './database';
export type { Product as ProductDB } from './database';
export * from './bookings';
export * from './product';

// Explicitly re-export user preferences to resolve ambiguity
export type { UserPreferences as AuthUserPreferences } from './auth';
export type { UserPreferences as DatabaseUserPreferences } from './database';

// Create aliases for booking types to fix the errors
export type { Booking as UIBooking } from './bookings';
