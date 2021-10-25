const checkHealth = require('./healthchek');

if (checkHealth()) {
  process.exit(0);
} else {
  process.exit(1);
}
