
const configGroup = (name, user, pass, ssl) => ({
  name, user, pass, ssl,
  connectionString: `postgres://${user}:${pass}@localhost:5432/${name}`
});

const config = {
  production: {ssl: true},
  development: configGroup('queerdev', 'queerdeveloper', 'secure', false),
  test: configGroup('queertest', 'queertester', 'secure', false),
  //TODO forward environments
};

module.exports = env => config[env];

