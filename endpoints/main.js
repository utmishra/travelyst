import express from 'express';
import { getAttractions as taGetAttractions, getRestaurants as taGetRestaurants } from '../services/tripadvisor.js';
import { getAttractions as gmGetAttractions, getRestaurants as gmGetRestaurants } from '../services/googleMaps.js';
import { getHotels } from '../services/bookingDotCom.js';

const router = express();

router.get('', (req, res) => {
  res.render('index');
});

const handleItinerary = async (city) => {
  const taAttractions = await taGetAttractions(city);
  const taRestaurants = await taGetRestaurants(city);
  const gmAttractions = await gmGetAttractions(city);
  const gmRestaurants = await gmGetRestaurants(city);
  const hotels = await getHotels(city);

  console.log('TripAdvisor Attractions:', taAttractions);
  console.log('TripAdvisor Restaurants:', taRestaurants);
  console.log('Google Maps Attractions:', gmAttractions);
  console.log('Google Maps Restaurants:', gmRestaurants);
  console.log('Hotels:', hotels);

  // Check if any of the service calls returned a status of false
  if (taAttractions.status === false) {
    throw { service: 'TripAdvisor', error: taAttractions.data };
  }
  if (taRestaurants.status === false) {
    throw { service: 'TripAdvisor', error: taRestaurants.data };
  }
  if (gmAttractions.status === false) {
    throw { service: 'GoogleMaps', error: gmAttractions.data };
  }
  if (gmRestaurants.status === false) {
    throw { service: 'GoogleMaps', error: gmRestaurants.data };
  }
  if (hotels.status === false) {
    throw { service: 'BookingDotCom', error: hotels.data };
  }

  return {
    taAttractions: taAttractions.data,
    taRestaurants: taRestaurants.data,
    gmAttractions: gmAttractions.data,
    gmRestaurants: gmRestaurants.data,
    hotels: hotels.data,
  };
};

router.get('/itinerary/:cityName', async (req, res) => {
  try {
    const city = req.params.cityName;
    const itineraryData = await handleItinerary(city);

    res.render('itinerary', itineraryData);
  } catch (error) {
    res.render('error', {
      service: `${error.service} Service Error`,
      error: error.error,
    });
  }
});

router.post('/itinerary', async (req, res) => {
  try {
    const city = req.body.city;
    console.log(`Requested city: ${city}`);
    const itineraryData = await handleItinerary(city);

    res.render('itinerary', itineraryData);
  } catch (error) {
    console.error('Error: ', error);
    res.render('error', {
      service: `${error.service} Service Error`,
      error: error.error,
    });
  }
});


export default router;
