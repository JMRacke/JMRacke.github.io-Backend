const url = require("url");
const express = require("express");
const router = express.Router();
const needle = require("needle");
const apicache = require("apicache");
const yelp = require("yelp-fusion");

// Env vars

const API_KEY_VALUE = process.env.YELP_KEY_VALUE;
const client = yelp.client(API_KEY_VALUE);
// init cache
let cache = apicache.middleware;

router.get("/", cache("2 minutes"), async (req, res) => {
  try {
    const urlReq = url.parse(req.url, true).query;

    const params = new URLSearchParams({
      //[API_KEY_NAME]: API_KEY_VALUE,
      ...url.parse(req.url, true).query,
    });
    console.log(params);
    const header = {
      headers: {
        Authorization: `${API_KEY_NAME} ${API_KEY_VALUE}`,
      },
    };
    const apiRes = await needle("get", `${API_BASE_URL}?${params}`, header);

    const data = apiRes.body;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
