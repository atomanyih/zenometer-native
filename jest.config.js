module.exports = {
  "preset": "react-native",
  "transform": {
    "^.+\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
    "^.+\\.tsx?$": "ts-jest"
  },
  "testMatch": [
    "**/__tests__/**/*.ts?(x)",
    "**/?(*.)+(spec|test).ts?(x)"
  ],
  "moduleFileExtensions": [
    "js",
    "ts",
    "tsx"
  ],
  "globals": {
    "ts-jest": {
      "tsconfig": "tsconfig.jest.json"
    }
  },
  "restoreMocks": true,
  "setupFilesAfterEnv": [
    "<rootDir>/src/test-setup/matchers.ts",
    "<rootDir>/src/test-setup/resetAsyncMocks.ts",
  ]
};
