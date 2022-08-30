const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    moduleDirectories: ['node_modules', '<rootDir>/'],
    testEnvironment: 'jest-environment-jsdom',
    collectCoverageFrom: [
        'src/**/*.{js,ts,jsx,tsx}',
        '!**/*.stories.tsx',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
        '!src/views/**/*.*',
        '!src/components/common/*.*',
        '!src/components/new/*.*',
        '!src/stories/**/*.*',
        '!src/components/legacy/*.*',
    ],
    moduleNameMapper: {
        // .svg should have high priority
        '\\.svg$': '<rootDir>/src/stories/mocks/svgrMock.js',
    },
    testPathIgnorePatterns: ['<rootDir>/cypress/'],
    coverageProvider: 'v8',
    coverageReporters: ['json', 'lcov', 'text', 'text-summary'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
