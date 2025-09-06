import { createServer } from './server.js';
import dotenv from 'dotenv';
dotenv.config();

const app = createServer();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`ecommerce api listening on :${port}`);
});
