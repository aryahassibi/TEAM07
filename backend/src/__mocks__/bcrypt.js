/*module.exports = {
    hash: jest.fn((password, saltRounds, callback) => callback(null, 'hashedPassword')),
    compare: jest.fn((password, hashedPassword, callback) => callback(null, password === 'password123')),
  };*/

  module.exports = {
    hash: jest.fn((password, saltRounds, callback) => callback(null, 'hashedPassword')),
    compare: jest.fn((password, hash, callback) => {
      // Always return true for test password
      callback(null, true);
    }),
  };