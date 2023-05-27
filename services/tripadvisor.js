import axios from "axios";

const getAttractions = async city => {
  const url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_API_KEY}&category=attractions&searchQuery=${city}&language=en`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await axios(url, options);
    const data = response.data.data;

    // Filter attractions with a rating of 3.5 or above
    const attractions = data.filter(
      location => parseFloat(location.rating) > 3.5
    );

    return { status: true, data: attractions };
  } catch (err) {
    console.error("Service: Tripadvisor, Error:", err.response);
    console.error("Referrer: ", err.request.res.rawHeaders);
    return {
      status: false,
      service: "taAttractions",
      data: err.response.data.Message,
    };
  }
};

const getRestaurants = async city => {
  const url = `https://api.content.tripadvisor.com/api/v1/location/search?key=${process.env.TRIPADVISOR_API_KEY}&category=restaurants&searchQuery=${city}&language=en`;
  console.info(`Calling: ${url}`);
  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await axios(url, options);
    const data = response.data.data;

    // Filter restaurants with a rating of 3.5 or above
    const restaurants = data.filter(
      location => parseFloat(location.rating) >= 3.5
    );

    return { status: true, data: restaurants };
  } catch (err) {
    console.error("Service: Tripadvisor, Error:", err.response.data.Message);
    console.error("Referrer: ", err.request.res.rawHeaders);
    return {
      status: false,
      service: "taRestaurants",
      data: err.response.data.Message,
    };
  }
};

export { getAttractions, getRestaurants };
