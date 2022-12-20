const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const app = express();

// enable CORS so browser won't turn down the connection
app.use(cors());

// 10min 100 call rate limiter
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.set("trust proxy", 1);

// Routes
app.use("/api", require("./routes/yelp"));
app.use("/places", require("./routes/places"));
app.use("/id", require("./routes/id"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
