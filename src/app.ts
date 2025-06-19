import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import articlesRoutes from './routes/articles';
import newsRoutes from './routes/news';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/articles', articlesRoutes);
app.use('/news', newsRoutes);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('News API is running!');
});

app.get('/articles', (req, res) => {
  res.json([]); // or your actual logic
});

export default app; 