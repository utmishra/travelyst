import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

const getAttractions = async (city) => {
  try {
    const response = await client.findPlaceFromText({
      params: {
        input: `attractions in ${city}`,
        inputtype: "textquery",
        key: process.env.GOOGLE_MAPS_API_KEY
      },
      timeout: 1000 // milliseconds
    });

    const attractions = response.data.candidates.filter(
      place => place.user_ratings_total > 25 && place.rating > 3.5
    );

    return { status: true, service: "GoogleMaps", data: attractions };
  } catch (err) {
    console.error(err);
    return { status: false, data: err.message };
  }
};

const getRestaurants = async (city) => {
  try {
    const response = await client.findPlaceFromText({
      params: {
        input: `vegan restaurants in ${city}`,
        inputtype: "textquery",
        key: process.env.GOOGLE_MAPS_API_KEY
      },
      timeout: 1000 // milliseconds
    });

    const restaurants = response.data.candidates.filter(
      place => place.user_ratings_total > 20 && place.rating > 3.5
    );

    return { status: true, data: restaurants };
  } catch (err) {
    console.error(err);
    return { status: true, service: "GoogleMaps", data: attractions };
  }
};

export { getAttractions, getRestaurants };
