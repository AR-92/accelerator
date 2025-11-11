const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'admin123';
  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(`Bcrypt hash for '${password}': ${hash}`);
}

generateHash();