const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

const app = require('../api/app');

const { MongoClient } = require('mongodb');

const { createDB, destroyDB } = require('./mongoMock')

chai.use(chaiHttp);

const { expect } = chai;

describe('POST /users', () => {
  describe('Será validado que o campo "name" é obrigatório', () => {
    let response;

    before(async () => {
      const user = {email: 'erickjaquin@gmail.com',password: '12345678'}
      response = await chai.request(app)
        .post('/users')
        .send(user)
    })
    it('Retorna status 400', () => {
      expect(response).to.have.status(400)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "message"', () => {
      expect(response.body).to.have.property('message')
    });

    it('A propriedade "message" possui uma mensagem de erro adequada', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.')
    });
  })

  describe('Será validado que o campo "email" é obrigatório', () => {
    let response;

    before(async () => {
      const user = {name: 'nome',password: '12345678'}
      response = await chai.request(app)
        .post('/users')
        .send(user)
    })
    it('Retorna status 400', () => {
      expect(response).to.have.status(400)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "message"', () => {
      expect(response.body).to.have.property('message')
    });

    it('A propriedade "message" possui uma mensagem de erro adequada', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.')
    });
  })

  describe('Será validado que não é possível cadastrar usuário com o campo email inválido', () => {
    let response;

    before(async () => {
      const user = {name: 'nome',password: '12345678', email: 'teste@'}
      response = await chai.request(app)
        .post('/users')
        .send(user)
    })
    it('Retorna status 400', () => {
      expect(response).to.have.status(400)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "message"', () => {
      expect(response.body).to.have.property('message')
    });

    it('A propriedade "message" possui uma mensagem de erro adequada', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.')
    });
  })

  describe('Será validado que o campo "senha" é obrigatório', () => {
    let response;
    let fakeDB;

    before(async () => {
      const newUser = {name: 'nome', email: 'teste@teste.com'}
      fakeDB = await createDB()
      sinon.stub(MongoClient, 'connect').resolves(fakeDB);
      response = await chai.request(app).post('/users').send(newUser).then((res) => res);
    })

    after(async () => {
      MongoClient.connect.restore();
    });

    it('Retorna status 400', () => {
      expect(response).to.have.status(400)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "message"', () => {
      expect(response.body).to.have.property('message')
    });

    it('A propriedade "message" possui uma mensagem de erro adequada', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.')
    });
  })

  describe('Será validado que é possível cadastrar usuário com sucesso', () => {
    let response;
    let fakeDB;

    before(async () => {
      const newUser = {name: 'nome', email: 'teste@teste.com', password: '123456'}
      fakeDB = await createDB()
      sinon.stub(MongoClient, 'connect').resolves(fakeDB);
      response = await chai.request(app).post('/users').send(newUser).then((res) => res);
    })

    after(async () => {
      MongoClient.connect.restore();
    });

    it('Retorna status 201', () => {
      expect(response).to.have.status(201)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "user"', () => {
      expect(response.body).to.have.property('user')
    });

    it('A propriedade "user" possui todos os campos necessarios', () => {
      expect(response.body.user).to.have.property('name')
      expect(response.body.user).to.have.property('email')
      expect(response.body.user).to.have.property('role')
      expect(response.body.user).to.have.property('_id')
    });
  })

  describe('Será validado que o campo "email" é único', () => {
    let response;
    let fakeDB;

    before(async () => {
      const newUser = {name: 'nome', email: 'teste@teste.com', password: '123456'}
      fakeDB = await createDB()
      sinon.stub(MongoClient, 'connect').resolves(fakeDB);
      chai.request(app).post('/users').send(newUser)
      response = await chai.request(app).post('/users').send(newUser).then((res) => res);
    })

    after(async () => {
      await fakeDB.db('Cookmaster').collection('users').deleteMany({})
      await MongoClient.connect.restore();
    });

    it('Retorna status 409', () => {
      expect(response).to.have.status(409)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "user"', () => {
      expect(response.body).to.have.property('message')
    });

    it('Objeto de resposta tem uma mensagem especifica', () => {
      expect(response.body.message).to.be.equal('Email already registered')
    });
  })
})

describe('endpoint para o login de usuários', () => {
  describe('Será validado que não é possível fazer login com um email inválido', () => {
    let response;
    let fakeDB;

    before(async () => {
      const user = {email: 'teste@teste.com', password: '123456'}
      fakeDB = await createDB()
      sinon.stub(MongoClient, 'connect').resolves(fakeDB);
      response = await chai.request(app).post('/login').send(user).then((res) => res);
    })

    after(async () => {
      await fakeDB.db('Cookmaster').collection('users').deleteMany({})
      await MongoClient.connect.restore();
    });

    it('Retorna status 401', () => {
      expect(response).to.have.status(401)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "user"', () => {
      expect(response.body).to.have.property('message')
    });

    it('Objeto de resposta tem uma mensagem especifica', () => {
      expect(response.body.message).to.be.equal('Incorrect username or password')
    });
  })

  describe('Será validado que não é possível fazer login com uma senha inválida', () => {
    let response;
    let fakeDB;

    before(async () => {
      const newUser = {name: 'nome', email: 'teste@teste.com', password: '123456'}
      const user = {email: 'teste@teste.com', password: '987654321'}
      fakeDB = await createDB()
      sinon.stub(MongoClient, 'connect').resolves(fakeDB);
      await chai.request(app).post('/users').send(newUser)

      response = await chai.request(app).post('/login').send(user).then((res) => res);
    })

    after(async () => {
      await MongoClient.connect.restore();
    });

    it('Retorna status 401', () => {
      expect(response).to.have.status(401)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "user"', () => {
      expect(response.body).to.have.property('message')
    });

    it('Objeto de resposta tem uma mensagem especifica', () => {
      expect(response.body.message).to.be.equal('Incorrect username or password')
    });
  })

  describe('Será validado que é possível fazer login com sucesso', () => {
    let response;
    let fakeDB;

    before(async () => {
      const newUser = {name: 'nome', email: 'teste@teste.com', password: '123456'}
      const user = {email: 'teste@teste.com', password: '123456'}
      fakeDB = await createDB()
      sinon.stub(MongoClient, 'connect').resolves(fakeDB);
      await chai.request(app).post('/users').send(newUser)

      response = await chai.request(app).post('/login').send(user).then((res) => res);
    })

    after(async () => {
      await MongoClient.connect.restore();
    });

    it('Retorna status 401', () => {
      expect(response).to.have.status(200)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "user"', () => {
      expect(response.body).to.have.property('token')
    });

    it('Objeto de resposta tem uma mensagem especifica', () => {
      expect(response.body.message).to.not.be.equal('')
    });
  })
})

describe('cadastro de receitas', () => {
  describe('Será validado que não é possível cadastrar uma receita com token invalido', () => {
    let response;
    let fakeDB;

    before(async () => {
      const user = {email: 'teste@teste.com', password: '123456'}
      fakeDB = await createDB()
      sinon.stub(MongoClient, 'connect').resolves(fakeDB);

      const newUser = {name: 'nome', email: 'teste@teste.com', password: '123456'}
      await chai.request(app).post('/users').send(newUser)

      const recipe = {name: 'Frango do jacquin',ingredients: 'Frango',preparation: '10 min no forno'}


      response = await chai.request(app).post('/recipes').set({Authorization:'6437658488'}).send(recipe).then((res) => res);
    })

    after(async () => {
      await MongoClient.connect.restore();
    });

    it('Retorna status 401', () => {
      expect(response).to.have.status(401)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "user"', () => {
      expect(response.body).to.have.property('message')
    });

    it('Objeto de resposta tem uma mensagem especifica', () => {
      expect(response.body.message).to.be.equal('jwt malformed')
    });
  })

  describe('Será validado que não é possível cadastrar receita sem o campo "name"', () => {
    let response;
    let fakeDB;

    before(async () => {
      const user = {email: 'teste@teste.com', password: '123456'}
      fakeDB = await createDB()
      sinon.stub(MongoClient, 'connect').resolves(fakeDB);

      const login = await chai.request(app).post('/login').send(user).then((res) => res)
      const { token } = login.body;

      const recipe = {ingredients: 'Frango',preparation: '10 min no forno'}


      response = await chai.request(app).post('/recipes').set({Authorization:token}).send(recipe).then((res) => res);
    })

    after(async () => {
      await MongoClient.connect.restore();
    });

    it('Retorna status 401', () => {
      expect(response).to.have.status(400)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "message"', () => {
      expect(response.body).to.have.property('message')
    });

    it('Objeto de resposta tem uma mensagem especifica', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.')
    });
  })

  describe('Será validado que não é possível cadastrar receita sem o campo "ingredients"', () => {
    let response;
    let fakeDB;

    before(async () => {
      const user = {email: 'teste@teste.com', password: '123456'}
      fakeDB = await createDB()
      sinon.stub(MongoClient, 'connect').resolves(fakeDB);

      const login = await chai.request(app).post('/login').send(user).then((res) => res)
      const { token } = login.body;

      const recipe = {name: 'Frango do jacquin',preparation: '10 min no forno'}


      response = await chai.request(app).post('/recipes').set({Authorization:token}).send(recipe).then((res) => res);
    })

    after(async () => {
      await MongoClient.connect.restore();
    });

    it('Retorna status 401', () => {
      expect(response).to.have.status(400)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "message"', () => {
      expect(response.body).to.have.property('message')
    });

    it('Objeto de resposta tem uma mensagem especifica', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.')
    });
  })

  describe('Será validado que não é possível cadastrar receita sem o campo "preparation"', () => {
    let response;
    let fakeDB;

    before(async () => {
      const user = {email: 'teste@teste.com', password: '123456'}
      fakeDB = await createDB()
      sinon.stub(MongoClient, 'connect').resolves(fakeDB);

      const login = await chai.request(app).post('/login').send(user).then((res) => res)
      const { token } = login.body;

      const recipe = {name: 'Frango do jacquin',ingredients: 'Frango'}


      response = await chai.request(app).post('/recipes').set({Authorization:token}).send(recipe).then((res) => res);
    })

    after(async () => {
      await MongoClient.connect.restore();
    });

    it('Retorna status 401', () => {
      expect(response).to.have.status(400)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "message"', () => {
      expect(response.body).to.have.property('message')
    });

    it('Objeto de resposta tem uma mensagem especifica', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.')
    });
  })


  describe('Será validado que é possível cadastrar uma receita com sucesso', () => {
    let response;
    let fakeDB;

    before(async () => {
      const user = {email: 'teste@teste.com', password: '123456'}
      fakeDB = await createDB()
      sinon.stub(MongoClient, 'connect').resolves(fakeDB);

      const login = await chai.request(app).post('/login').send(user).then((res) => res)
      const { token } = login.body;

      const recipe = {name: 'Frango do jacquin',ingredients: 'Frango',preparation: '10 min no forno'}


      response = await chai.request(app).post('/recipes').set({Authorization:token}).send(recipe).then((res) => res);
    })

    after(async () => {
      await MongoClient.connect.restore();
    });

    it('Retorna status 201', () => {
      expect(response).to.have.status(201)
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.a('object')
    });

    it('Objeto de resposta tem uma propriedade chamada "recipe"', () => {
      expect(response.body).to.have.property('recipe')
    });

    it('propriedade chamada "recipe" tem propriedades especificas', () => {
      expect(response.body.recipe).to.have.property('name')
      expect(response.body.recipe).to.have.property('ingredients')
      expect(response.body.recipe).to.have.property('preparation')
      expect(response.body.recipe).to.have.property('userId')
      expect(response.body.recipe).to.have.property('_id')
    });

    it('Objeto de resposta tem valores corretos', () => {
      expect(response.body.recipe.name).to.be.equal('Frango do jacquin')
      expect(response.body.recipe.ingredients).to.be.equal('Frango')
      expect(response.body.recipe.preparation).to.be.equal('10 min no forno')
    });
  })
})