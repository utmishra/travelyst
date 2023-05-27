import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

const summarizeOpeningHours = openingHours => {
  if (!openingHours) return null;
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const formattedHours = openingHours.map((hour, i) => ({
    day: days[i],
    hours: hour.split(": ")[1],
  }));
  let summary = [];
  let currentDayRange = { startDay: null, endDay: null, hours: null };

  formattedHours.forEach((formattedHour, i) => {
    if (currentDayRange.hours === formattedHour.hours) {
      currentDayRange.endDay = formattedHour.day;
    } else {
      if (currentDayRange.startDay) {
        summary.push(
          `${currentDayRange.startDay} - ${currentDayRange.endDay}: ${currentDayRange.hours}`
        );
      }
      currentDayRange = {
        startDay: formattedHour.day,
        endDay: formattedHour.day,
        hours: formattedHour.hours,
      };
    }
  });

  // Push last range
  summary.push(
    `${currentDayRange.startDay} - ${currentDayRange.endDay}: ${currentDayRange.hours}`
  );

  return summary;
};

const getAttractions = async city => {
  try {
    const response = await client.findPlaceFromText({
      params: {
        input: `attractions in ${city}`,
        inputtype: "textquery",
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000, // milliseconds
    });

    const attractionPromises = response.data.candidates.map(async place => {
      const attraction = await client.placeDetails({
        params: {
          place_id: place.place_id,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
        timeout: 1000,
      });

      const summarisedOpeningHours = summarizeOpeningHours(
        attraction.data.result.opening_hours.weekday_text
      );
      return { ...attraction.data.result, summarisedOpeningHours };
    });

    const attractions = await Promise.all(attractionPromises);

    return { status: true, service: "GoogleMaps", data: attractions };
  } catch (err) {
    const errorMessage = err.response ? err.response.data.error_message : err;
    console.error("Service: Google Maps, Error: ", errorMessage);
    return {
      status: false,
      data: errorMessage,
      service: "gmAttractions",
    };
  }
};

const getRestaurants = async city => {
  try {
    const response = await client.findPlaceFromText({
      params: {
        input: `vegan restaurants in ${city}`,
        inputtype: "textquery",
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000, // milliseconds
    });

    const restaurantPromises = response.data.candidates.map(async place => {
      const restaurant = await client.placeDetails({
        params: {
          place_id: place.place_id,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
        timeout: 1000,
      });

      const summarisedOpeningHours = summarizeOpeningHours(
        restaurant.data.result.opening_hours.weekday_text
      );
      return { ...restaurant.data.result, summarisedOpeningHours };
    });

    const restaurants = await Promise.all(restaurantPromises);

    return { status: true, data: restaurants };
  } catch (err) {
    const errorMessage = err.response ? err.response.data.error_message : err;
    console.error("Service: Google Maps, Error: ", errorMessage);
    return {
      status: false,
      data: errorMessage,
      service: "gmRestaurants",
    };
  }
};

export { getAttractions, getRestaurants };
