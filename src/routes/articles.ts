import { Router, Response } from 'express';
import { authenticateJWT, AuthRequest } from '../middleware/auth';
import Article from '../models/Article';

const router = Router();

// Get all articles (protected)
router.get('/', authenticateJWT, async (_req: AuthRequest, res: Response) => {
  try {
    const articles = await Article.find().populate('author', 'email');
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch articles.' });
  }
});

// Get single article by ID (protected)
router.get('/:id', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const article = await Article.findById(req.params.id).populate('author', 'email');
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch article.' });
  }
});

// Create an article (protected)
router.post('/', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }
    const article = new Article({
      title,
      content,
      author: req.user.userId,
    });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create article.' });
  }
});

// Update an article (protected, only author)
router.put('/:id', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    if (article.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to update this article.' });
    }
    const { title, content } = req.body;
    if (title) article.title = title;
    if (content) article.content = content;
    await article.save();
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update article.' });
  }
});

// Delete an article (protected, only author)
router.delete('/:id', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found.' });
    if (article.author.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this article.' });
    }
    await article.deleteOne();
    res.json({ message: 'Article deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete article.' });
  }
});

export default router; 