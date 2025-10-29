import app from "./app.js";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 HRInsight Pro Backend running locally at http://localhost:${PORT}`);
});
