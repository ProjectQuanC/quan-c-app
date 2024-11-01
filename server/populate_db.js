const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fetchGitHubUser(username) {
  try {
    const response = await axios.get(`https://api.github.com/users/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching GitHub user data:", error);
    throw error;
  }
}

async function main() {
  await prisma.userRole.createMany({
    data: [
      { role_name: 'user' },
      { role_name: 'admin' }
    ],
    skipDuplicates: true  });

    const adminRole = await prisma.userRole.findFirst({
    where: { role_name: 'admin' }
  });

  const userRole = await prisma.userRole.findFirst({
    where: { role_name: 'user' }
  });

  if (!adminRole) throw new Error("Admin role not found");
  if (!userRole) throw new Error("User role not found");

  const username = process.env.USER_NAME;
  if (!username) throw new Error("USER_NAME environment variable not set");

  const githubUserData = await fetchGitHubUser(username);

   await prisma.user.createMany({
    data: [
      {
        role_id: adminRole.role_id,
        github_id: githubUserData.id.toString(), // Using the GitHub user's ID as github_id
      },
      {
        role_id: userRole.role_id,
        github_id: '' // Replace with another GitHub user ID if necessary
      }
    ]
  });

}

main()
  .catch(e => {
    console.error("An error occurred:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });