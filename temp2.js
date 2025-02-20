import bcrypt from 'bcrypt'

const passwordHash = await bcrypt.hash('AnonyWasHere@11', 10);
console.log(passwordHash)