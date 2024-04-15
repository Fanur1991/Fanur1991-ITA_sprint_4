import { app } from './infrastructure/webserver/app';
import dotenv from 'dotenv'; // Import dotenv to manage environment variables.

dotenv.config(); // Load environment variables from a .env file into process.env.

// Set the port from environment variables or use a default value if not specified.
const PORT = process.env.PORT || 3002;

// Start the server on the specified port.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
