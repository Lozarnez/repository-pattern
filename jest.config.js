module.exports = {
  // Otras configuraciones de Jest
  moduleNameMapper: {
    '^@db/(.*)$': '<rootDir>/src/app/shared/db/$1',
    '^@lib$': '<rootDir>/src/app/shared/lib',
    '^@service/(.*)$': '<rootDir>/src/app/shared/service/$1',
    '^@repository/(.*)$': '<rootDir>/src/app/shared/repository/$1',
  },
};
