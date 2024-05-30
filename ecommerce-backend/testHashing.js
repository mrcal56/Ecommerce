const bcrypt = require('bcryptjs');

const runTest = async () => {
  const password = 'password123';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('Hashed password:', hashedPassword);

  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('Comparing passwords');
  console.log('Entered password:', password);
  console.log('Stored password:', hashedPassword);
  console.log('Password match result:', isMatch);
};

runTest();
