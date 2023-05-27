import express from "express";
import {
  getAttractions as taGetAttractions,
  getRestaurants as taGetRestaurants,
} from "../services/tripadvisor.js";
import {
  getAttractions as gmGetAttractions,
  getRestaurants as gmGetRestaurants,
} from "../services/googleMaps.js";
import { getHotels } from "../services/bookingDotCom.js";

const router = express();

router.get("", (req, res) => {
  res.render("index");
});

const handleItinerary = async city => {
  const taAttractions = await taGetAttractions(city);
  const taRestaurants = await taGetRestaurants(city);
  const gmAttractions = await gmGetAttractions(city);
  const gmRestaurants = await gmGetRestaurants(city);
  const hotels = await getHotels(city);

  return {
    taAttractions,
    taRestaurants,
    gmAttractions,
    gmRestaurants,
    hotels,
  };
};

router.get("/itinerary/:cityName", async (req, res) => {
  try {
    console.log("Received city: ", req.params.cityName);
    const city = req.params.cityName;
    console.log("City name", city);
    const itineraryData = await handleItinerary(city);

    res.render("itinerary", itineraryData);
  } catch (error) {
    res.render("error", {
      service: `${error.service} Service Error`,
      error: error.error,
    });
  }
});

router.post("/itinerary", async (req, res) => {
  const city = req.body.city;
  console.log(`Requested city: ${city}`);
  const itineraryData = await handleItinerary(city);
  if (
    itineraryData.taAttractions.status === false ||
    itineraryData.gmAttractions.status === false ||
    itineraryData.taRestaurants.status === false ||
    itineraryData.gmRestaurants.status === false ||
    itineraryData.hotels.status === false
  ) {
    const errorService = Object.values(itineraryData).find(
      service => service.status === false
    );
    console.error(`Error in ${errorService.service} service`);
    console.error(itineraryData);
    // console.error(itineraryData[errorService].data);
    res.render("error", {
      service: `${errorService.service} Service Error`,
      error: errorService.data,
    });
  } else {
    res.render("itinerary", itineraryData);
  }
});

export default router;
