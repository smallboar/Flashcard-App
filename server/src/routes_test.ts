import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { list, load, saveScore, listScores, save, resetForTesting} from './routes';


describe('routes', function() {
  it('list', function() {
    //Test 1: Empty, and then length 1 and length 2, and length 2 w/ replace.
    const req_empty = httpMocks.createRequest();
    const res_empty = httpMocks.createResponse();
    assert.deepEqual(list(req_empty, res_empty), undefined);

    const req_save1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/save', query: {name: "William"}, body:{data:'Fang'}});
    const res_save1 = httpMocks.createResponse();
    save(req_save1, res_save1);

    list(req_save1, res_save1)

    assert.deepEqual(res_save1._getData(), {list: ['William']});

    const req_save2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/save', query:{name:'CSE'}, body: {data:'331'}});
    const res_save2 = httpMocks.createResponse();
    save(req_save2, res_save2);

    list(req_save2, res_save2)
    assert.deepEqual(res_save2._getData(), {list: ['William', 'CSE']});

    const req_save3 = httpMocks.createRequest(
      {method: 'POST', url:'/api/save', query:{name:'CSE'}, body:{data:'332'}});
    const res_save3 = httpMocks.createResponse();
    save(req_save3, res_save3);

    list(req_save3, res_save3)
    assert.deepEqual(res_save3._getData(), {list: ['William', 'CSE']});

    resetForTesting();
  });

  it('listScores', function() {
    //Test 1: Empty, and then length 1 and length 2, and length 2 w/ replace.
    const req_empty = httpMocks.createRequest();
    const res_empty = httpMocks.createResponse();
    assert.deepEqual(listScores(req_empty, res_empty), undefined);

    const req_save1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "William"}, body:{score:100, testname: "SAT"}});
    const res_save1 = httpMocks.createResponse();
    saveScore(req_save1, res_save1);

    listScores(req_save1, res_save1)

    assert.deepEqual(res_save1._getData(), {list: ['William, SAT: 100']}, "" + res_save1._getStatusCode());

    const req_save2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query:{name:'CSE331'}, body: {score:50, testname: "Midterm"}});
    const res_save2 = httpMocks.createResponse();
    saveScore(req_save2, res_save2);

    listScores(req_save2, res_save2)
    assert.deepEqual(res_save2._getData(), {list: ['William, SAT: 100', 'CSE331, Midterm: 50']});

    const req_save3 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query:{name:'CSE311'}, body:{score:100, testname: "Quiz"}});
    const res_save3 = httpMocks.createResponse();
    saveScore(req_save3, res_save3);

    listScores(req_save3, res_save3)
    assert.deepEqual(res_save3._getData(), {list: ['William, SAT: 100', 'CSE331, Midterm: 50', "CSE311, Quiz: 100"]});

    resetForTesting();
  });

  it('saveScore', function() {
    //Subdomain 1; Name == undefined
    const req_save_undef1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: undefined}, body:{score:100, testname: "SAT"}});
    const res_save_undef1 = httpMocks.createResponse();
    saveScore(req_save_undef1, res_save_undef1);

    assert.deepEqual(res_save_undef1._getStatusCode(), 400);

    const req_save_undef2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {}, body:{score:100, testname: "SAT"}});
    const res_save_undef2 = httpMocks.createResponse();
    saveScore(req_save_undef2, res_save_undef2);

    assert.deepEqual(res_save_undef2._getStatusCode(), 400);
    //Subdomain 2: Name is not of type string
    const req_save_not_str1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: 510}, body:{score:100, testname: "SAT"}});
    const res_save_not_str1 = httpMocks.createResponse();
    saveScore(req_save_not_str1, res_save_not_str1);

    assert.deepEqual(res_save_not_str1._getStatusCode(), 400);

    const req_save_not_str2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: [1]}, body:{score:100, testname: "SAT"}});
    const res_save_not_str2 = httpMocks.createResponse();
    saveScore(req_save_not_str2, res_save_not_str2);

    assert.deepEqual(res_save_not_str2._getStatusCode(), 400);
    //Subdomain 3: Score is undefined
    const req_save_score_undef1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "Joe"}, body:{score:undefined, testname: "SAT"}});
    const res_save_score_undef1 = httpMocks.createResponse();
    saveScore(req_save_score_undef1, res_save_score_undef1);

    assert.deepEqual(res_save_score_undef1._getStatusCode(), 400);

    const req_save_score_undef2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "Joe"}, body:{testname: "SAT"}});
    const res_save_score_undef2 = httpMocks.createResponse();
    saveScore(req_save_score_undef2, res_save_score_undef2);

    assert.deepEqual(res_save_score_undef2._getStatusCode(), 400);

    //Subdomain 4: Score is null
    const req_save_score_null1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "Joe"}, body:{score:null, testname: "SAT"}});
    const res_save_score_null1 = httpMocks.createResponse();
    saveScore(req_save_score_null1, res_save_score_null1);

    assert.deepEqual(res_save_score_null1._getStatusCode(), 400);
    //Subdomain 5: Score is not a number
    const req_save_score_not_num1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "Joe"}, body:{score:"50", testname: "SAT"}});
    const res_save_score_not_num1 = httpMocks.createResponse();
    saveScore(req_save_score_not_num1, res_save_score_not_num1);

    assert.deepEqual(res_save_score_not_num1._getStatusCode(), 400);

    const req_save_score_not_num2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "Joe"}, body:{score:["not a number"], testname: "SAT"}});
    const res_save_score_not_num2 = httpMocks.createResponse();
    saveScore(req_save_score_not_num2, res_save_score_not_num2);

    assert.deepEqual(res_save_score_not_num2._getStatusCode(), 400);
    //Subdomain 6: Testname is undefined
    const req_save_testname_undef1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "Joe"}, body:{score:12308, testname: undefined}});
    const res_save_testname_undef1 = httpMocks.createResponse();
    saveScore(req_save_testname_undef1, res_save_testname_undef1);

    assert.deepEqual(res_save_testname_undef1._getStatusCode(), 400);

    const req_save_testname_undef2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "Joe"}, body:{score:12308}});
    const res_save_testname_undef2 = httpMocks.createResponse();
    saveScore(req_save_testname_undef2, res_save_testname_undef2);

    assert.deepEqual(res_save_testname_undef2._getStatusCode(), 400);

    //Subdomain 7: Testname is null
    const req_save_testname_null1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "Joe"}, body:{score:12308, testname: null}});
    const res_save_testname_null1 = httpMocks.createResponse();
    saveScore(req_save_testname_null1, res_save_testname_null1);

    assert.deepEqual(res_save_testname_null1._getStatusCode(), 400);
    //Subdomain 8: Testname is not a string
    const req_save_testname_not_str1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "Joe"}, body:{score:12308, testname: 1}});
    const res_save_testname_not_str1 = httpMocks.createResponse();
    saveScore(req_save_testname_not_str1, res_save_testname_not_str1);

    assert.deepEqual(res_save_testname_not_str1._getStatusCode(), 400);

    const req_save_testname_not_str2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "Joe"}, body:{score:12308, testname: [true]}});
    const res_save_testname_not_str2 = httpMocks.createResponse();
    saveScore(req_save_testname_not_str2, res_save_testname_not_str2);

    assert.deepEqual(res_save_testname_not_str2._getStatusCode(), 400);
    //Subdomain 9: Normal!
    const req_save_good1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "Joe"}, body:{score:12308, testname: "Mama"}});
    const res_save_good1 = httpMocks.createResponse();
    saveScore(req_save_good1, res_save_good1);

    assert.deepEqual(res_save_good1._getStatusCode(), 200);

    const req_save_good2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/saveScore', query: {name: "Bob"}, body:{score:10, testname: "SAT"}});
    const res_save_good2 = httpMocks.createResponse();
    saveScore(req_save_good2, res_save_good2);

    assert.deepEqual(res_save_good2._getStatusCode(), 200);
    
  });


  it('save', function() {
    //First subdomian: Name is not passed as a parameter, or is not a string
    const req0 = httpMocks.createRequest(
        {method: 'POST', url:'/api/save', query: {}, body:{}});
    const res0 = httpMocks.createResponse();
    save(req0, res0);
    
    assert.strictEqual(res0._getStatusCode(), 400);
    resetForTesting();

    const req_name = httpMocks.createRequest(
      {method: 'POST', url:'/api/save', query: {name: 1}, body:{}});
    const res_name = httpMocks.createResponse();
    save(req_name, res_name);

    assert.strictEqual(res_name._getStatusCode(), 400);
    resetForTesting();

    //Second subdomain: Body is not passed as a parameter
    const req_body1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/save', query: {name: "bob"}, body:{}});
    const res_body1 = httpMocks.createResponse();
    save(req_body1, res_body1);
    
    assert.strictEqual(res_body1._getStatusCode(), 400);
    resetForTesting();

    const req_body2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/save', query: {name: "William"}, body:{}});
    const res_body2 = httpMocks.createResponse();
    save(req_body2, res_body2);

    assert.strictEqual(res_body2._getStatusCode(), 400);
    resetForTesting();

    //Third Subdomain: Name and body are both passed in.
    //Only testing for a correct status code, as we will test the contents in
    //the tests for "load".
    const req_success1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/save', query:{name:'William'}, body:{data:'Fang'}});
    const res_success1 = httpMocks.createResponse();
    save(req_success1, res_success1);

    assert.strictEqual(res_success1._getStatusCode(), 200);
    resetForTesting();

    const req_success2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/save', query:{name:'CSE'}, body:{data:'331'}});
    const res_success2 = httpMocks.createResponse();
    save(req_success2, res_success2);

    assert.strictEqual(res_success2._getStatusCode(), 200);
    resetForTesting();
  });

  it('load', function() {
    //First subdomian: Name is not passed as a parameter, or is not a string.

    //Only one possible no name
    const req0 = httpMocks.createRequest(
      {method: 'GET', url:'/api/load', query:{}});
    const res0 = httpMocks.createResponse();
    load(req0, res0);
    
    assert.strictEqual(res0._getStatusCode(), 400);
    resetForTesting();

    //Two tests for name not being a string
    const req_name = httpMocks.createRequest(
      {method: 'GET', url:'/api/load', query:{name: 1}});
    const res_name = httpMocks.createResponse();
    load(req_name, res_name);

    assert.strictEqual(res_name._getStatusCode(), 400);
    resetForTesting();

    const req_name1 = httpMocks.createRequest(
      {method: 'GET', url:'/api/load', query:{name: [0]}});
    const res_name1 = httpMocks.createResponse();
    load(req_name1, res_name1);

    assert.strictEqual(res_name._getStatusCode(), 400);
    resetForTesting();    

    //Second subdomain: There is no saved file under that name.
    const req_body1 = httpMocks.createRequest(
      {method: 'GET', url:'/api/load', query:{name: 'anything'}});
    const res_body1 = httpMocks.createResponse();
    load(req_body1, res_body1);
    
    assert.strictEqual(res_body1._getStatusCode(), 404);
    resetForTesting();

    const req_body2 = httpMocks.createRequest(
      {method: 'GET', url:'/api/load', query:{name: "nada"}});
    const res_body2 = httpMocks.createResponse();
    load(req_body2, res_body2);

    assert.strictEqual(res_body2._getStatusCode(), 404);
    resetForTesting();

    //Third Subdomain: We get the file back succesfully

    const req_save_success1 = httpMocks.createRequest(
      {method: 'POST', url:'/api/save', query:{name:'CSE'},body:{data:'331'}});
    const res_save_success1 = httpMocks.createResponse();
    save(req_save_success1, res_save_success1);

    const req_load_success1 = httpMocks.createRequest(
      {method: 'GET', url:'/api/load', query:{name: "CSE"}});
    const res_load_success1 = httpMocks.createResponse();
    load(req_load_success1, res_load_success1);

    assert.strictEqual(res_load_success1._getStatusCode(), 200);
    assert.deepEqual(res_load_success1._getData(), {data: '331'});
    resetForTesting();

    const req_save_success2 = httpMocks.createRequest(
      {method: 'POST', url:'/api/save', query:{name:'William'}, body:{data:'Fang wrote this'}});
    const res_save_success2 = httpMocks.createResponse();
    save(req_save_success2, res_save_success2);

    const req_load_success2 = httpMocks.createRequest(
      {method: 'GET', url:'/api/load', query:{name: "William"}});
    const res_load_success2 = httpMocks.createResponse();
    load(req_load_success2, res_load_success2);

    assert.strictEqual(res_load_success2._getStatusCode(), 200);
    assert.deepEqual(res_load_success2._getData(), {data: 'Fang wrote this'});
    resetForTesting();
  });
  

});
