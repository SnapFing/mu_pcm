/**
 * packages/backend/api/index.js
 *
 * Vercel Serverless entry-point.
 * This file re-exports the Express app so Vercel can treat it as a
 * serverless function.  Place this at:
 *   packages/backend/api/index.js
 */

// Force IPv4 – avoids "ENETUNREACH" on Vercel's IPv6-less network
const https = require("https");
const http  = require("http");
https.globalAgent = new https.Agent({ family: 4 });
http.globalAgent  = new http.Agent({ family: 4 });

// Load env (harmless no-op on Vercel, which injects env vars itself)
require("dotenv").config();

// Re-export the Express app
const app = require("../src/index");

module.exports = app;