
import { Tour as DBTour } from '@/types/database';
import { Tour as ComponentTour } from '@/data/tours';

// Convert database tour object to the format expected by components
export const adaptDBTourToComponentTour = (dbTour: DBTour): ComponentTour => {
  return {
    id: dbTour.id,
    title: dbTour.title,
    description: dbTour.description,
    image: dbTour.image_url,
    price: dbTour.price,
    duration: dbTour.duration,
    rating: dbTour.rating,
    category: dbTour.category,
    maxParticipants: dbTour.max_participants,
    inclusions: dbTour.includes,
    exclusions: dbTour.excludes,
    schedule: dbTour.schedule,
    requirements: dbTour.notes,
    location: dbTour.meeting_point,
    featured: false // Default to false since DB schema doesn't have this field
  };
};
