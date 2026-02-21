/**
 * TensorFlow.js Polyfills for React Native
 * 
 * These polyfills are required for TensorFlow.js to work in React Native environment.
 * Import this file before using TensorFlow.js.
 */

// @ts-ignore
if (typeof global.Buffer === 'undefined') {
  // @ts-ignore
  global.Buffer = require('buffer').Buffer;
}

export {};
