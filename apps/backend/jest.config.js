module.exports = {
    coverageDirectory: "coverage",

    testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],

    testEnvironment: 'node',

    testPathIgnorePatterns: [
        "/node_modules/"
    ],

    setupFiles: [
        'dotenv/config'
    ],

    transform: {
        "^.+\\.js$": "babel-jest"
    },

    preset: '@shelf/jest-mongodb'


};
