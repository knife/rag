//Create a sample user

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

const prisma = new PrismaClient()

async function main() {
   
    const hashedPassword = await bcrypt.hash('test', 12)

    const user = await prisma.user.create({
        data: {
            email: 'test@test.com',
            password: hashedPassword,
            name: 'Test User'
        }

    })

    console.log(`✅ Created user: ${user.name} (${user.email})`);


}

main()
    .then(async () => {
        await prisma.$disconnect()
        console.log('✅ Seeded database');
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })