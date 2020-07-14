const MyClass = require('../src/myClass');
const chai = require('chai');
const sinon = require('sinon');
const chaiaspromise = require('chai-as-promised');
const myObj = new MyClass();
const expect = chai.expect;
const nock = require('nock');

// middleware
chai.use(chaiaspromise);

// Test suit is a collection of related test cases
describe('Test Suit', () => {
  after(() => {
    console.log('--------- After the test suit');
  });

  before(() => {
    console.log('--------- Before the test suit');
  });

  afterEach(() => {});

  beforeEach(() => {
    sinon.restore();
  });

  it('Test the add method', () => {
    expect(myObj.add(2, 3)).to.be.equal(5);
  });

  it('Spy the add method', () => {
    const spy = sinon.spy(myObj, 'add');
    const arg1 = 10,
      arg2 = 20;
    myObj.callAnotherFn(arg1, arg2);
    // sinon.assert.calledOnce(spy);
    expect(spy.calledOnce).to.be.true;
    expect(spy.calledWith(10, 20)).to.be.true;
  });

  it('Spy the callback method', () => {
    const spy = sinon.spy();
    myObj.callTheCallback(spy);
    expect(spy.calledOnce).to.be.true;
  });

  it('Mock the sayHello method', () => {
    const mock = sinon.mock(myObj);
    const expectation = mock.expects('sayHello');
    expectation.exactly(1);
    expectation.withArgs('Hello Bot Here..');
    myObj.callAnotherFn(10, 20);
    mock.verify();
  });
});

describe('Test suit for stub', () => {
  it('Stub the add method', () => {
    const stub = sinon.stub(myObj, 'add');
    stub
      .withArgs(10, 20)
      .onFirstCall()
      .returns(100)
      .onSecondCall()
      .returns(200);
    expect(myObj.callAnotherFn(10, 20)).to.be.equal(100);
    expect(myObj.callAnotherFn(10, 20)).to.be.equal(200);
  });
});

describe('Test the promise', () => {
  it('Promise test case', function () {
    this.timeout(0);
    // myObj.testPromise().then(result => {
    //   expect(result).to.be.equal(6);
    //   done();
    // });
    return expect(myObj.testPromise()).to.eventually.equal(6);
  });
});

describe('XHR test suit', function () {
  it('Mock and stub xhr call', function (done) {
    var obj = { id: 123 };
    const scope = nock('https://echo-service-new.herokuapp.com')
      .post('/echo')
      .reply(200, obj);
    myObj
      .xhrFn()
      .then(function (result) {
        expect(result).to.be.eql(obj);
        done();
      })
      .catch(error => {
        done(new Error('test case failed: ' + error));
      });
  });
});
