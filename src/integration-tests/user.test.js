const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { getConnection } = require('./connectionMock');
const { MongoClient } = require('mongodb');


chai.use(chaiHttp);

const app = require('../api/app');

const { expect } = chai;

describe('POST /user', () => {
  describe('Criando um novo usuário sem nenhum campo', () => {
    let response;
    before(async () => {
      response = await chai.request(app)
        .post('/users')
        .send({})
    })
    it('retorna status 400', () => {
      expect(response).to.have.status(400);
    })
    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    })
    it('retorna uma propriedade "message"', () => {
      expect(response.body).to.have.a.property('message');
    })
    it('retorna uma mensagem "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    })
  })

  describe('Criando um novo usuário sem campo "name"', () => {
    let response;
    let request = {
      email: 'teste@email.com',
      password: '123456',
    }
    before(async () => {
      response = await chai.request(app)
        .post('/users')
        .send(request)
    })
    it('retorna status 400', () => {
      expect(response).to.have.status(400);
    })
    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    })
    it('retorna uma propriedade "message"', () => {
      expect(response.body).to.have.a.property('message');
    })
    it('retorna uma mensagem "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    })
  })
  describe('Criando um novo usuário sem campo "email"', () => {
    let response;
    let request = {
      name: 'teste',
      password: '123456',
    }
    before(async () => {
      response = await chai.request(app)
        .post('/users')
        .send(request)
    })
    it('retorna status 400', () => {
      expect(response).to.have.status(400);
    })
    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    })
    it('retorna uma propriedade "message"', () => {
      expect(response.body).to.have.a.property('message');
    })
    it('retorna uma mensagem "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    })
  })
  describe('Criando um novo usuário sem campo "password"', () => {
    let response;
    let request = {
      name: 'teste',
      email: 'teste@email.com',
    }
    before(async () => {
      response = await chai.request(app)
        .post('/users')
        .send(request)
    })
    it('retorna status 400', () => {
      expect(response).to.have.status(400);
    })
    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    })
    it('retorna uma propriedade "message"', () => {
      expect(response.body).to.have.a.property('message');
    })
    it('retorna uma mensagem "Invalid entries. Try again."', () => {
      expect(response.body.message).to.be.equal('Invalid entries. Try again.');
    })
  })
  describe('Criando um novo usuário que já exista no banco', () => {
    let connectionMock;

    let response;
    let request = {
      name: 'teste',
      email: 'teste@email.com',
      password: '123456'
    }

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      
      await chai.request(app)
        .post('/users')
        .send(request)

      response = await chai.request(app)
        .post('/users')
        .send(request)
    })

    after(() => {
      MongoClient.connect.restore();
    })
    
    it('retorna status 409', () => {
      expect(response).to.have.status(409);
    })
    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    })
    it('retorna as informações do usuário criado', () => {
      expect(response.body).to.have.a.property('message');
      expect(response.body.message).to.be.equal('Email already registered');
    })
  })
  describe('Criando um novo usuário com sucesso', () => {
    let connectionMock;

    let response;
    let request = {
      name: 'teste',
      email: 'teste@email.com',
      password: '123456'
    }

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      
      response = await chai.request(app)
        .post('/users')
        .send(request)
    })

    after(() => {
      MongoClient.connect.restore();
    })
    
    it('retorna status 201', () => {
      expect(response).to.have.status(201);
    })
    it('retorna um objeto', () => {
      expect(response.body).to.be.an('object');
    })
    it('retorna as informações do usuário criado', () => {
      expect(response.body.user).to.have.a.property('name');
      expect(response.body.user).to.have.a.property('email');
      expect(response.body.user).to.have.a.property('role');
      expect(response.body.user).not.to.have.a.property('password');
      expect(response.body.user.email).to.be.equal('teste@email.com');
      expect(response.body.user.name).to.be.equal('teste');
      expect(response.body.user.role).to.be.equal('user');
    })
  })
})