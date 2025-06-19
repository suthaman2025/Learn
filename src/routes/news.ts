import { Router, Response } from 'express';
import axios from 'axios';
import { authenticateJWT, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /news/external - Fetch top headlines from NewsAPI.org
router.get('/external', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: 'NewsAPI key not configured.' });
    }
    const { data } = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        apiKey,
      },
    });
    res.json(data.articles);
  } catch (error) {
    console.error('NewsAPI fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch news from NewsAPI.org.' });
  }
});

export default router; 