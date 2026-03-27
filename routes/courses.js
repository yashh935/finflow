const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { courses, glossary } = require('../data/courses');

// In-memory user progress store
const userProgress = new Map();

function getOrCreateProgress(userId) {
  if (!userProgress.has(userId)) {
    userProgress.set(userId, {
      userId,
      xp: 0,
      streak: 1,
      level: 1,
      completedLessons: [],
      completedCourses: [],
      badges: [],
      lastActivity: new Date().toISOString()
    });
  }
  return userProgress.get(userId);
}

function calcLevel(xp) {
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 1000) return 4;
  if (xp < 2000) return 5;
  return Math.floor(xp / 400) + 1;
}

// GET all courses (summary)
router.get('/', (req, res) => {
  const summary = courses.map(({ id, title, emoji, tier, lessonsCount, duration, difficulty, color, description }) => ({
    id, title, emoji, tier, lessonsCount, duration, difficulty, color, description
  }));
  res.json({ success: true, courses: summary, total: courses.length });
});

// GET single course with lessons
router.get('/:courseId', (req, res) => {
  const course = courses.find(c => c.id === req.params.courseId);
  if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
  res.json({ success: true, course });
});

// GET specific lesson
router.get('/:courseId/lessons/:lessonId', (req, res) => {
  const course = courses.find(c => c.id === req.params.courseId);
  if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
  const lesson = course.lessons.find(l => l.id === req.params.lessonId);
  if (!lesson) return res.status(404).json({ success: false, error: 'Lesson not found' });
  res.json({ success: true, lesson, courseTitle: course.title });
});

// POST mark lesson complete + award XP
router.post('/:courseId/lessons/:lessonId/complete', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ success: false, error: 'userId required' });

  const course = courses.find(c => c.id === req.params.courseId);
  if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
  const lesson = course.lessons.find(l => l.id === req.params.lessonId);
  if (!lesson) return res.status(404).json({ success: false, error: 'Lesson not found' });

  const progress = getOrCreateProgress(userId);
  const lessonKey = `${req.params.courseId}:${req.params.lessonId}`;
  
  let xpEarned = 0;
  let newBadge = null;

  if (!progress.completedLessons.includes(lessonKey)) {
    progress.completedLessons.push(lessonKey);
    xpEarned = lesson.xp || 15;
    progress.xp += xpEarned;
    progress.level = calcLevel(progress.xp);

    // Check for badges
    if (progress.completedLessons.length === 1 && !progress.badges.includes('first_lesson')) {
      progress.badges.push('first_lesson');
      newBadge = { id: 'first_lesson', name: '🎯 First Step', description: 'Completed your first lesson!' };
    }
    if (progress.xp >= 100 && !progress.badges.includes('century_xp')) {
      progress.badges.push('century_xp');
      newBadge = { id: 'century_xp', name: '💯 Century Club', description: 'Earned 100 XP!' };
    }
  }

  progress.lastActivity = new Date().toISOString();

  res.json({
    success: true,
    xpEarned,
    totalXp: progress.xp,
    level: progress.level,
    newBadge,
    message: xpEarned > 0 ? `+${xpEarned} XP earned! Keep going! 🔥` : 'Already completed — but review is always good!'
  });
});

// GET user progress dashboard
router.get('/progress/:userId', (req, res) => {
  const progress = userProgress.get(req.params.userId);
  if (!progress) return res.status(404).json({ success: false, error: 'User progress not found' });
  
  const nextLevelXp = progress.level < 5 ? [100, 250, 500, 1000, 2000][progress.level - 1] : (progress.level * 400);
  
  res.json({
    success: true,
    progress: {
      ...progress,
      nextLevelXp,
      progressToNextLevel: Math.floor((progress.xp / nextLevelXp) * 100)
    }
  });
});

// GET glossary
router.get('/glossary/all', (req, res) => {
  const { search, category } = req.query;
  let results = glossary;
  if (search) results = results.filter(g => g.term.toLowerCase().includes(search.toLowerCase()) || g.definition.toLowerCase().includes(search.toLowerCase()));
  if (category) results = results.filter(g => g.category === category);
  
  const categories = [...new Set(glossary.map(g => g.category))];
  res.json({ success: true, terms: results, total: results.length, categories });
});

// POST submit quiz answers
router.post('/:courseId/lessons/:lessonId/quiz', (req, res) => {
  const { answers, userId } = req.body;
  const course = courses.find(c => c.id === req.params.courseId);
  const lesson = course?.lessons.find(l => l.id === req.params.lessonId);
  
  if (!lesson || lesson.type !== 'quiz') {
    return res.status(404).json({ success: false, error: 'Quiz not found' });
  }

  let correct = 0;
  const results = lesson.questions.map((q, i) => {
    const isCorrect = answers[i] === q.answer;
    if (isCorrect) correct++;
    return { question: q.q, yourAnswer: q.options[answers[i]], correctAnswer: q.options[q.answer], isCorrect, explanation: q.explanation };
  });

  const score = Math.round((correct / lesson.questions.length) * 100);
  const xpEarned = score >= 80 ? lesson.xp : Math.floor(lesson.xp * 0.4);
  
  if (userId) {
    const progress = getOrCreateProgress(userId);
    progress.xp += xpEarned;
    progress.level = calcLevel(progress.xp);
  }

  res.json({
    success: true,
    score,
    correct,
    total: lesson.questions.length,
    xpEarned,
    results,
    passed: score >= 70,
    message: score >= 80 ? '🏆 Excellent! You nailed it!' : score >= 70 ? '✅ Passed! Keep practicing to improve.' : '💪 Not quite — review the lesson and try again!'
  });
});

module.exports = router;
