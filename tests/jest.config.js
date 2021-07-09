module.exports = {
  testEnvironment: 'node',
  preset: "ts-jest",
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  moduleFileExtensions: ['js', 'd.ts', 'ts', 'json'],
};

process.env.SANDCASTLE_URL = 'https://api.sandcastle.example';
process.env.SANDCASTLE_TENANT = 'test-tenant';
process.env.SANDCASTLE_CLIENT_ID = 'some-random-id';
process.env.SANDCASTLE_CLIENT_SECRET = 'this-is-very-secret';
