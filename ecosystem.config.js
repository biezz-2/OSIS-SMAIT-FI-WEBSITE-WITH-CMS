module.exports = {
  apps: [
    {
      name: 'osis-strapi-backend',
      script: 'npm',
      args: 'run start',
      cwd: './strapi-cms',
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
      },
    },
    {
      name: 'osis-next-frontend',
      script: 'npm',
      args: 'run start:solo',
      cwd: './osis-smait-fi',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
      },
    },
  ],
};
