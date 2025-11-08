const { db } = require('../../config/database');

// Ideas operations
const getAllIdeas = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM ideas ORDER BY rating DESC', [], (err, rows) => {
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

// Portfolio operations
const getAllPortfolio = () => {
  return new Promise((resolve, reject) => {
    db.all(
      'SELECT * FROM portfolio ORDER BY updatedDate DESC',
      [],
      (err, rows) => {
        if (err) reject(err);
        else
          resolve(
            rows.map((row) => ({ ...row, tags: JSON.parse(row.tags || '[]') }))
          );
      }
    );
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

const addVoteForIdea = (ideaSlug, voteData) => {
  return new Promise((resolve, reject) => {
    const {
      marketViability,
      realWorldProblem,
      innovation,
      technicalFeasibility,
      scalability,
      marketSurvival,
      userId,
    } = voteData;
    db.run(
      'INSERT INTO votes (ideaSlug, marketViability, realWorldProblem, innovation, technicalFeasibility, scalability, marketSurvival, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        ideaSlug,
        marketViability,
        realWorldProblem,
        innovation,
        technicalFeasibility,
        scalability,
        marketSurvival,
        userId,
      ],
      function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
};

module.exports = {
  getAllIdeas,
  getIdeaByHref,
  getAllPortfolio,
  getPortfolioById,
  getVotesForIdea,
  addVoteForIdea,
};
