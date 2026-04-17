require('dotenv').config();
const { app, connectMongo } = require('./app');

connectMongo().catch(() => process.exit(1));

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`🌸 Joy Diary API listening on http://localhost:${PORT}`);
});
