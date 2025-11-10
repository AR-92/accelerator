const { db } = require('../../../config/database');
const bcrypt = require('bcrypt');

// User operations
const createUser = async (
  email,
  password,
  firstName,
  lastName,
  role = 'startup'
) => {
  const passwordHash = await bcrypt.hash(password, 12);
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
      [email, passwordHash, firstName, lastName, role],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT id, email, first_name, last_name, role, created_at FROM users WHERE id = ?',
      [id],
      (err, row) => {
        if (err) reject(err);
        else resolve(row);
      }
    );
  });
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Ideas operations
const getAllIdeas = (userId = null) => {
  const query = userId
    ? 'SELECT * FROM ideas WHERE user_id = ? ORDER BY rating DESC'
    : 'SELECT * FROM ideas ORDER BY rating DESC';
  const params = userId ? [userId] : [];
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else
        resolve(
          rows.map((row) => ({ ...row, tags: JSON.parse(row.tags || '[]') }))
        );
    });
  });
};

const getIdeaByHref = (href) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM ideas WHERE href = ?', [href], (err, row) => {
      if (err) reject(err);
      else resolve(row ? { ...row, tags: JSON.parse(row.tags || '[]') } : null);
    });
  });
};

const createIdea = (userId, ideaData) => {
  const { href, title, type, typeIcon, rating, description, tags } = ideaData;
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO ideas (user_id, href, title, type, typeIcon, rating, description, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        href,
        title,
        type,
        typeIcon,
        rating,
        description,
        JSON.stringify(tags || []),
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

// Portfolio operations
const getAllPortfolio = (userId = null) => {
  const query = userId
    ? 'SELECT * FROM portfolio WHERE user_id = ? ORDER BY updated_at DESC'
    : 'SELECT * FROM portfolio ORDER BY updated_at DESC';
  const params = userId ? [userId] : [];
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else
        resolve(
          rows.map((row) => ({ ...row, tags: JSON.parse(row.tags || '[]') }))
        );
    });
  });
};

const getPortfolioById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM portfolio WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row ? { ...row, tags: JSON.parse(row.tags || '[]') } : null);
    });
  });
};

const createPortfolio = (userId, portfolioData) => {
  const { title, description, category, tags, isPublic, image } = portfolioData;
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO portfolio (user_id, title, description, category, tags, isPublic, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        title,
        description,
        category,
        JSON.stringify(tags || []),
        isPublic,
        image,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

// Votes operations
const getVotesForIdea = (ideaSlug) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM votes WHERE ideaSlug = ? ORDER BY timestamp DESC',
      [ideaSlug],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const addVoteForIdea = (ideaSlug, userId, voteData) => {
  return new Promise((resolve, reject) => {
    const {
      marketViability,
      realWorldProblem,
      innovation,
      technicalFeasibility,
      scalability,
      marketSurvival,
    } = voteData;
    db.run(
      'INSERT INTO votes (user_id, ideaSlug, marketViability, realWorldProblem, innovation, technicalFeasibility, scalability, marketSurvival) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userId,
        ideaSlug,
        marketViability,
        realWorldProblem,
        innovation,
        technicalFeasibility,
        scalability,
        marketSurvival,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

// Projects operations
const getUserProjects = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM projects WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const createProject = (userId, title, description) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO projects (user_id, title, description) VALUES (?, ?, ?)',
      [userId, title, description],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

// AI Interactions
const addAiInteraction = (userId, modelType, prompt, response) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO ai_interactions (user_id, model_type, prompt, response) VALUES (?, ?, ?, ?)',
      [userId, modelType, prompt, response],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

const getUserAiInteractions = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM ai_interactions WHERE user_id = ? ORDER BY timestamp DESC',
      [userId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

// Reports
const createReport = (userId, type, content) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO reports (user_id, type, content) VALUES (?, ?, ?)',
      [userId, type, content],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

const getUserReports = (userId) => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM reports WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  verifyPassword,
  getAllIdeas,
  getIdeaByHref,
  createIdea,
  getAllPortfolio,
  getPortfolioById,
  createPortfolio,
  getVotesForIdea,
  addVoteForIdea,
  getUserProjects,
  createProject,
  addAiInteraction,
  getUserAiInteractions,
  createReport,
  getUserReports,
};
