module.exports = {
  testEnvironment: 'node',
  preset: "ts-jest",
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  moduleFileExtensions: ['js', 'd.ts', 'ts', 'json'],
};

process.env.AUTH0_FGA_ENVIRONMENT = 'playground';
process.env.AUTH0_FGA_STORE_ID = 'test-random-store-id';
process.env.AUTH0_FGA_CLIENT_ID = 'some-random-id';
process.env.AUTH0_FGA_CLIENT_SECRET = 'this-is-very-secret';
