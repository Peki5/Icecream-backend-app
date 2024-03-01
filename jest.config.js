const packageJson = require('./package.json');

module.exports = {
    verbose: true,
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testRegex: '(.*.test.(js|jsx|ts|tsx)$)',
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    collectCoverage: true,
    coveragePathIgnorePatterns: ['/node_modules/', '/config/'],
    modulePaths: ['<rootDir>/src', '<rootDir>/node_modules'],
    coverageReporters: ['json', 'lcov', 'text', 'clover', 'cobertura'],
    coverageDirectory: './tests-coverage',
    errorOnDeprecated: true,
    notify: false,
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: './test-results/',
                outputName: './junit.xml',
                classNameTemplate: '{classname}: {title}',
                titleTemplate: '{classname}: {title}',
                ancestorSeparator: ' > ',
            }
        ],
        [
            'jest-html-reporter', {
                pageTitle: `Internship - REST - Evaluation Validation Report for ${packageJson.username}`,
                outputPath: './test-results/test-report.html',
                includeFailureMsg: true,
            }
        ],
    ],
    watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/tests-coverage/', '<rootDir>/test-results/'],
};