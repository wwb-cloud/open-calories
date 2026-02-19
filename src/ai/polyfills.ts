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

// Polyfill for fetch if needed
// @ts-ignore
if (typeof global.fetch === 'undefined') {
  // @ts-ignore
  global.fetch = require('node-fetch');
}

export {};
