const bcrypt = require('bcryptjs');
bcrypt.compare('password123', '$2b$10$gm5xtMdTFxQmHgREgmE5aeWRDbzGhODWMvy3nDH23uaD9bdZwvi6S').then(console.log);
