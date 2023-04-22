const url = require("url");
const express = require("express");
const router = express.Router();
const needle = require("needle");
const apicache = require("apicache");

// Environment Variables from .env on herokuapp
const API_BASE_URL = process.env.YELP_API_URL;
const API_KEY_NAME = process.env.YELP_KEY_NAME;
const API_KEY_VALUE = process.env.YELP_KEY_VALUE;

// Initializes a cache so if the same GET is sent within a 30 minute period, it will use the cached results. Since we are making a lot of API calls from the same location, this cuts down on the number of calls to the actual API
let cache = apicache.middleware;

router.get("/", cache("30 minutes"), async (req, res) => {
  try {
    // Format parameters from url
    console.log("HERES THE PAYLOAD");
    console.log(req);
    console.log("--------------------------------------------");
    //console.log(`HERES THE PAYLOAD!!! ${paramstring}`);
    const params = new URLSearchParams({
      ...url.parse(req.url, true).query,
    });
    console.log(params);
    const header = {
      headers: {
        Authorization: `${API_KEY_NAME} ${API_KEY_VALUE}`,
      },
    };

    // Performs the real API call to the Yelp server with the API key in the header
    const apiRes = await needle("get", `${API_BASE_URL}?${params}`, header);

    // Returns the body of the response and a successful status code to originator
    const data = apiRes.body;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
