const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { getConnection } = require('./connectionMock');
const { MongoClient } = require('mongodb');

chai.use(chaiHttp);

const app = require('../api/app');

const { expect } = chai;

describe('POST /recipes ', () => {
  let connectionMock;

    let token;
    let response;

    let user = {
      name: 'teste',
      email: 'teste@email.com',
      password: '123456'
    }

    let login = {
      email: 'teste@email.com',
      password: '123456'
    }

    let recipe = {
      name: 'melhor miojo do mundo',
      ingredients: 'água, miojo, requeijão',
      preparation: 'ferve a água, cozinha o miojo, tempera e mistura com o requeijão'
    }

    let noNameRecipe = {
      ingredients: 'água, miojo, requeijão',
      preparation: 'ferve a água, cozinha o miojo, tempera e mistura com o requeijão'
    }

    let noIngredientsRecipe = {
      name: 'melhor miojo do mundo',
      preparation: 'ferve a água, cozinha o miojo, tempera e mistura com o requeijão'
    }

    let noPrepRecipe = {
      name: 'melhor miojo do mundo',
      ingredients: 'água, miojo, requeijão',
    }

  describe('sem estar autenticado', async () => {

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      
      await chai.request(app)
        .post('/users')
        .send(user)
      
      token = await chai.request(app)
        .post('/login')
        .send(login)
    })

    after(() => {
      MongoClient.connect.restore();
    })
    response = await chai.request(app)
      .post('/recipes')
      .set('headers', { 'authorization': '' })
      .send(recipe)
    
    it('retorna um objeto com a mensagem "jwt malformed"', () => {
      expect(response).to.be.an('object');
      expect(response.body).to.have.a.property('message');
      expect(response.body.message).to.be.equal('jwt malformed');
    })
  });
  describe('sem o campo "name"', async () => {

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      
      await chai.request(app)
        .post('/users')
        .send(user)
      
      token = await chai.request(app)
        .post('/login')
        .send(login)
    })

    after(() => {
      MongoClient.connect.restore();
    })

    response = await chai.request(app)
      .post('/recipes')
      .set('headers', { 'authorization': token })
      .send(noNameRecipe)
    
    it('retorna um objeto na response', () => {
      expect(response).to.be.an('object');
    });

    it('retorna um campo "message" na response', () => {
      expect(response.body).to.have.a.property('message');
    });

    it('retorna a mensagem "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    })
  });
  describe('sem o campo "ingredients"', async () => {

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      
      await chai.request(app)
        .post('/users')
        .send(user)
      
      token = await chai.request(app)
        .post('/login')
        .send(login)
    })

    after(() => {
      MongoClient.connect.restore();
    })

    response = await chai.request(app)
      .post('/recipes')
      .set('headers', { 'authorization': token })
      .send(noIngredientsRecipe)
    
    it('retorna um objeto na response', () => {
      expect(response).to.be.an('object');
    });

    it('retorna um campo "message" na response', () => {
      expect(response.body).to.have.a.property('message');
    });

    it('retorna a mensagem "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    })
  });
  describe('sem o campo "preparation"', async () => {

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      
      await chai.request(app)
        .post('/users')
        .send(user)
      
      token = await chai.request(app)
        .post('/login')
        .send(login)
    })

    after(() => {
      MongoClient.connect.restore();
    })

    response = await chai.request(app)
      .post('/recipes')
      .set('headers', { 'authorization': token })
      .send(noPrepRecipe)
    
    it('retorna um objeto na response', () => {
      expect(response).to.be.an('object');
    });

    it('retorna um campo "message" na response', () => {
      expect(response.body).to.have.a.property('message');
    });

    it('retorna a mensagem "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    })
  });
  describe('com autenticação e todos os campos corretos', async () => {

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      
      await chai.request(app)
        .post('/users')
        .send(user)
      
      token = await chai.request(app)
        .post('/login')
        .send(login)
    })

    after(() => {
      MongoClient.connect.restore();
    })

    response = await chai.request(app)
      .post('/recipes')
      .set('headers', { 'authorization': token })
      .send(recipe)
    
    it('retorna um objeto na response', () => {
      expect(response).to.be.an('object');
    });

    it('retorna um campo "message" na response', () => {
      expect(response.body).to.have.a.property('recipe');
    });

    it('retorna a receita cadastrada', () => {
      expect(response.body.recipe.name).to.be.equal('Invalid entries. Try again.');
      expect(response.body.recipe.ingredients).to.be.equal('Invalid entries. Try again.');
      expect(response.body.recipe.preparation).to.be.equal('Invalid entries. Try again.');
      expect(response.body.recipe.userId).to.be.equal(1);
    })
  })
})

describe('/GET /recipes', () => {
  
})