import axios from 'axios';

const rapidApiKey = 'RAPIDAPI_KEY';
const rapidApiHost = 'booking-com.p.rapidapi.com';

const searchLocationsOrHotels = async (query) => {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://${rapidApiHost}/v1/hotels/locations`,
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost,
      },
      params: {
        query,
      },
    });

    return { status: true, data: response.data };
  } catch (err) {
    console.error('error:', err);
    return { status: false, service: 'booking.com', data: err.message };
  }
};

export const getHotels = async (city) => {
  try {
    const locationsOrHotels = await searchLocationsOrHotels(city);
    console.log(locationsOrHotels);

    // Perform further processing or filtering of data as per your requirements
    // For now, returning a dummy object
    return { status: true, data: { city, hotels: [] } };
  } catch (err) {
    console.error('error:', err);
    return { status: false, service: 'booking.com', data: err.message };
  }
};
