import axios from "axios";

const rapidApiKey = "RAPIDAPI_KEY";
const rapidApiHost = "booking-com.p.rapidapi.com";

const searchLocationsOrHotels = async query => {
  const response = await axios({
    method: "GET",
    url: `https://${rapidApiHost}/v1/hotels/locations`,
    headers: {
      "x-rapidapi-key": rapidApiKey,
      "x-rapidapi-host": rapidApiHost,
    },
    params: {
      query,
    },
  });

  return { status: true, data: response.data };
};

export const getHotels = async city => {
  try {
    const locationsOrHotels = await searchLocationsOrHotels(city);
    console.log(locationsOrHotels);

    // Perform further processing or filtering of data as per your requirements
    // For now, returning a dummy object
    return { status: true, data: { city, hotels: [] } };
  } catch (err) {
    console.error("Service: Booking.com, Error: ", err.response.data.message);
    return {
      status: false,
      service: "hotels",
      data: err.response.data.message,
    };
  }
};
