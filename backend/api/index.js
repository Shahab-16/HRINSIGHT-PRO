// backend/api/index.js
import serverless from "serverless-http";
import app from "../app.js";

export default serverless(app);

// If you need to handle large bodies or custom multipart parsing later:
// export const config = { api: { bodyParser: false } };
