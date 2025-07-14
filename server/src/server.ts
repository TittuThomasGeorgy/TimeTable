import colors from 'colors';
colors.enable();
import mongoose from 'mongoose';
import app from './app';
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`.blue));
  })
  .catch(err => console.error('DB Connection Failed', err));
