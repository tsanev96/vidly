const bcrypt = require('bcrypt');

// we need a salt to hash a password
// 1234 -> abcd - it is one way

// always use genSalt - async
// sync slower

async function run() {
    const salt = await bcrypt.genSalt(10); // promise, dont pass callback
    // we get diff salt everytime
    const hashed = await bcrypt.hash('1234', salt);
    console.log(hashed)
}

run()