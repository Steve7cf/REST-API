const bcrypt = require('bcrypt')

async function hash(pin) {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(pin, salt)

    const match = await bcrypt.compare(pin, password)
    console.log(match)
}



console.log(hash('12345'))