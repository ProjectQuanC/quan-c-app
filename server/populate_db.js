const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Inserting roles
    await prisma.userRole.createMany({
        data: [
            { role_name: 'user' },
            { role_name: 'admin' }
        ]
    });

    // Retrieving the role_id for the 'admin' role
    const adminRole = await prisma.userRole.findFirst({
        where: {
            role_name: 'admin'
        }
    });

    // Retrieving the role_id for the 'user' role'
    const userRole = await prisma.userRole.findFirst({
        where: {
            role_name: 'user'
        }
    });

    if (!adminRole) {
        throw new Error("Admin role not found");
    }

    if (!userRole) {
        throw new Error("User role not found");
    }

    //(UNCOMMENT THIS IF YOU WANT TO INSERT ADMIN USER!)

    // await prisma.user.createMany({
    //     data: [
    //         {
    //             role_id: adminRole.role_id,
    //             github_id: '', // FILL WITH ADMIN GITHUB ID
    //         },
    //         {
    //             role_id: userRole.role_id,
    //             github_id: '', // FILL WITH USER GITHUB ID (OPTIONAL)
    //         }
    //     ]
    // });


}

main()
    .catch(e => {
        throw e;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
