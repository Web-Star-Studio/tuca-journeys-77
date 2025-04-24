
// Re-export all types from this central file
export * from './auth';
export * from './database';
export * from './event';
export * from './partner';

// Explicitly re-export types that have naming conflicts
export type { Booking as UIBooking } from './bookings';
export type { Booking as DatabaseBooking } from './database';

// Re-export product types with explicit naming
export type { Product as UIProduct } from './product';
export type { Product as DatabaseProduct } from './database';

// Explicitly re-export user preferences to resolve ambiguity
export type { UserPreferences as AuthUserPreferences } from './auth';
export type { UserPreferences as DatabaseUserPreferences } from './database';
