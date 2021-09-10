const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

const OPTIONS = { useNewUrlParser: true, useUnifiedTopology: true };

const getConnection = async () => {
  const DBServer = await MongoMemoryServer.create();
  const URLMock = DBServer.getUri();
  return MongoClient.connect(URLMock, OPTIONS);
}

module.exports = { getConnection }

// esse mock é muito semelhante ao nosso arquivo models/connection.js e funciona basicamente da mesma forma.
// a diferença é que vamos usar esse mock com o sinon para que o banco seja simulado.