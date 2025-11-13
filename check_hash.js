const bcrypt = require('bcrypt');

async function checkHash() {
  const hash = '$2b$12$E0g1bCofErMU0kU1MvQNFecWnvQDLQquFQ1ezEybViRBOEmbwM3iu';
  const possiblePasswords = ['admin123', 'admin', 'password', 'password123', '123456'];
  
  for (const password of possiblePasswords) {
    const match = await bcrypt.compare(password, hash);
    console.log(`Password: ${password} -> Match: ${match}`);
  }
}

checkHash();