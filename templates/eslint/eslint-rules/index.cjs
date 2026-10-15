// Adaptado de vibe-coding-toolkit (MIT), Copyright (c) 2026 Matheus Gomes.
"use strict";

const {
  maxLines,
  noDirectConsole,
  noDirectDataAccess,
} = require("./core-rules.cjs");

module.exports = {
  rules: {
    "max-lines": maxLines,
    "no-direct-console": noDirectConsole,
    "no-direct-data-access": noDirectDataAccess,
  },
};
