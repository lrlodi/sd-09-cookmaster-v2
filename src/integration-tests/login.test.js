const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const { getConnection } = require('./connectionMock');
const { MongoClient } = require('mongodb');

chai.use(chaiHttp);

const app = require('../api/app');

const { expect } = chai;

describe('POST /login', () => {
  describe('Login falha quando um ou ambos os campos não é informado', () => {
    let connectionMock;

    let noReqResponse;
    let noEmailRes;
    let noPwdRes;
    let wrongPwdRes;
    let wrongEmailRes;
    let correctRes;

    let request = {
      name: 'teste',
      email: 'teste@email.com',
      password: '123456'
    }

    let correctReq = {
      email: 'teste@email.com',
      password: '123456'
    };

    let noEmailRequest = {
      email: 'teste@email.com',
    };

    let noPwdRequest = {
      password: '123456'
    }

    let wrongEmailReq = {
      email: 'teste@gmail.com',
      password: '123456'
    }

    let wrongPassReq = {
      email: 'teste@email.com',
      password: '123'
    }

    before(async () => {

      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);

      await chai.request(app)
        .post('/users')
        .send(request)

      noReqResponse = await chai.request(app)
        .post('/login')
        .send({});

      noEmailRes = await chai.request(app)
        .post('/login')
        .send(noEmailRequest)

      noPwdRes = await chai.request(app)
        .post('/login')
        .send(noPwdRequest)

      wrongPwdRes = await chai.request(app)
        .post('/login')
        .send(wrongPassReq)

      wrongEmailRes = await chai.request(app)
        .post('/login')
        .send(wrongEmailReq)

      correctRes = await chai.request(app)
        .post('/login')
        .send(correctReq)
    })

    after(() => {
      MongoClient.connect.restore();
    })

    it('retorna status corretos', () => {
      expect(noReqResponse).to.have.status(401);
      expect(noEmailRes).to.have.status(401);
      expect(noPwdRes).to.have.status(401);
      expect(wrongEmailRes).to.have.status(401);
      expect(wrongPwdRes).to.have.status(401);
      expect(correctRes).to.have.status(200);
    })
    it('retorna um objeto', () => {
      expect(noReqResponse.body).to.be.an('object');
      expect(noEmailRes.body).to.be.an('object');
      expect(noPwdRes.body).to.be.an('object');
      expect(wrongPwdRes.body).to.be.an('object');
      expect(wrongEmailRes.body).to.be.an('object');
      expect(correctRes.body).to.be.an('object');
    })
    it('retorna uma propriedade "message"', () => {
      expect(noReqResponse.body).to.have.a.property('message');
      expect(noEmailRes.body).to.have.a.property('message');
      expect(noPwdRes.body).to.have.a.property('message');
      expect(wrongPwdRes.body).to.have.a.property('message');
      expect(wrongEmailRes.body).to.have.a.property('message');
      expect(correctRes.body).to.have.a.property('token');
    })
    it('retorna mensagem compatível', () => {
      expect(noReqResponse.body.message).to.be.equal('All fields must be filled');
      expect(noEmailRes.body.message).to.be.equal('All fields must be filled');
      expect(noPwdRes.body.message).to.be.equal('All fields must be filled');
      expect(wrongEmailRes.body.message).to.be.equal('Incorrect username or password');
      expect(wrongPwdRes.body.message).to.be.equal('Incorrect username or password');
    })
  })
});