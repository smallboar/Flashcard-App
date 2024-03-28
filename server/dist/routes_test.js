"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const httpMocks = __importStar(require("node-mocks-http"));
const routes_1 = require("./routes");
describe('routes', function () {
    it('list', function () {
        //Test 1: Empty, and then length 1 and length 2, and length 2 w/ replace.
        const req_empty = httpMocks.createRequest();
        const res_empty = httpMocks.createResponse();
        assert.deepEqual((0, routes_1.list)(req_empty, res_empty), undefined);
        const req_save1 = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { name: "William" }, body: { data: 'Fang' } });
        const res_save1 = httpMocks.createResponse();
        (0, routes_1.save)(req_save1, res_save1);
        (0, routes_1.list)(req_save1, res_save1);
        assert.deepEqual(res_save1._getData(), { list: ['William'] });
        const req_save2 = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { name: 'CSE' }, body: { data: '331' } });
        const res_save2 = httpMocks.createResponse();
        (0, routes_1.save)(req_save2, res_save2);
        (0, routes_1.list)(req_save2, res_save2);
        assert.deepEqual(res_save2._getData(), { list: ['William', 'CSE'] });
        const req_save3 = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { name: 'CSE' }, body: { data: '332' } });
        const res_save3 = httpMocks.createResponse();
        (0, routes_1.save)(req_save3, res_save3);
        (0, routes_1.list)(req_save3, res_save3);
        assert.deepEqual(res_save3._getData(), { list: ['William', 'CSE'] });
        (0, routes_1.resetForTesting)();
    });
    it('listScores', function () {
        //Test 1: Empty, and then length 1 and length 2, and length 2 w/ replace.
        const req_empty = httpMocks.createRequest();
        const res_empty = httpMocks.createResponse();
        assert.deepEqual((0, routes_1.listScores)(req_empty, res_empty), undefined);
        const req_save1 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "William" }, body: { score: 100, testname: "SAT" } });
        const res_save1 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save1, res_save1);
        (0, routes_1.listScores)(req_save1, res_save1);
        assert.deepEqual(res_save1._getData(), { list: ['William, SAT: 100'] }, "" + res_save1._getStatusCode());
        const req_save2 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: 'CSE331' }, body: { score: 50, testname: "Midterm" } });
        const res_save2 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save2, res_save2);
        (0, routes_1.listScores)(req_save2, res_save2);
        assert.deepEqual(res_save2._getData(), { list: ['William, SAT: 100', 'CSE331, Midterm: 50'] });
        const req_save3 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: 'CSE311' }, body: { score: 100, testname: "Quiz" } });
        const res_save3 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save3, res_save3);
        (0, routes_1.listScores)(req_save3, res_save3);
        assert.deepEqual(res_save3._getData(), { list: ['William, SAT: 100', 'CSE331, Midterm: 50', "CSE311, Quiz: 100"] });
        (0, routes_1.resetForTesting)();
    });
    it('saveScore', function () {
        //Subdomain 1; Name == undefined
        const req_save_undef1 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: undefined }, body: { score: 100, testname: "SAT" } });
        const res_save_undef1 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_undef1, res_save_undef1);
        assert.deepEqual(res_save_undef1._getStatusCode(), 400);
        const req_save_undef2 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: {}, body: { score: 100, testname: "SAT" } });
        const res_save_undef2 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_undef2, res_save_undef2);
        assert.deepEqual(res_save_undef2._getStatusCode(), 400);
        //Subdomain 2: Name is not of type string
        const req_save_not_str1 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: 510 }, body: { score: 100, testname: "SAT" } });
        const res_save_not_str1 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_not_str1, res_save_not_str1);
        assert.deepEqual(res_save_not_str1._getStatusCode(), 400);
        const req_save_not_str2 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: [1] }, body: { score: 100, testname: "SAT" } });
        const res_save_not_str2 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_not_str2, res_save_not_str2);
        assert.deepEqual(res_save_not_str2._getStatusCode(), 400);
        //Subdomain 3: Score is undefined
        const req_save_score_undef1 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "Joe" }, body: { score: undefined, testname: "SAT" } });
        const res_save_score_undef1 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_score_undef1, res_save_score_undef1);
        assert.deepEqual(res_save_score_undef1._getStatusCode(), 400);
        const req_save_score_undef2 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "Joe" }, body: { testname: "SAT" } });
        const res_save_score_undef2 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_score_undef2, res_save_score_undef2);
        assert.deepEqual(res_save_score_undef2._getStatusCode(), 400);
        //Subdomain 4: Score is null
        const req_save_score_null1 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "Joe" }, body: { score: null, testname: "SAT" } });
        const res_save_score_null1 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_score_null1, res_save_score_null1);
        assert.deepEqual(res_save_score_null1._getStatusCode(), 400);
        //Subdomain 5: Score is not a number
        const req_save_score_not_num1 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "Joe" }, body: { score: "50", testname: "SAT" } });
        const res_save_score_not_num1 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_score_not_num1, res_save_score_not_num1);
        assert.deepEqual(res_save_score_not_num1._getStatusCode(), 400);
        const req_save_score_not_num2 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "Joe" }, body: { score: ["not a number"], testname: "SAT" } });
        const res_save_score_not_num2 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_score_not_num2, res_save_score_not_num2);
        assert.deepEqual(res_save_score_not_num2._getStatusCode(), 400);
        //Subdomain 6: Testname is undefined
        const req_save_testname_undef1 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "Joe" }, body: { score: 12308, testname: undefined } });
        const res_save_testname_undef1 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_testname_undef1, res_save_testname_undef1);
        assert.deepEqual(res_save_testname_undef1._getStatusCode(), 400);
        const req_save_testname_undef2 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "Joe" }, body: { score: 12308 } });
        const res_save_testname_undef2 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_testname_undef2, res_save_testname_undef2);
        assert.deepEqual(res_save_testname_undef2._getStatusCode(), 400);
        //Subdomain 7: Testname is null
        const req_save_testname_null1 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "Joe" }, body: { score: 12308, testname: null } });
        const res_save_testname_null1 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_testname_null1, res_save_testname_null1);
        assert.deepEqual(res_save_testname_null1._getStatusCode(), 400);
        //Subdomain 8: Testname is not a string
        const req_save_testname_not_str1 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "Joe" }, body: { score: 12308, testname: 1 } });
        const res_save_testname_not_str1 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_testname_not_str1, res_save_testname_not_str1);
        assert.deepEqual(res_save_testname_not_str1._getStatusCode(), 400);
        const req_save_testname_not_str2 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "Joe" }, body: { score: 12308, testname: [true] } });
        const res_save_testname_not_str2 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_testname_not_str2, res_save_testname_not_str2);
        assert.deepEqual(res_save_testname_not_str2._getStatusCode(), 400);
        //Subdomain 9: Normal!
        const req_save_good1 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "Joe" }, body: { score: 12308, testname: "Mama" } });
        const res_save_good1 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_good1, res_save_good1);
        assert.deepEqual(res_save_good1._getStatusCode(), 200);
        const req_save_good2 = httpMocks.createRequest({ method: 'POST', url: '/api/saveScore', query: { name: "Bob" }, body: { score: 10, testname: "SAT" } });
        const res_save_good2 = httpMocks.createResponse();
        (0, routes_1.saveScore)(req_save_good2, res_save_good2);
        assert.deepEqual(res_save_good2._getStatusCode(), 200);
    });
    it('save', function () {
        //First subdomian: Name is not passed as a parameter, or is not a string
        const req0 = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: {}, body: {} });
        const res0 = httpMocks.createResponse();
        (0, routes_1.save)(req0, res0);
        assert.strictEqual(res0._getStatusCode(), 400);
        (0, routes_1.resetForTesting)();
        const req_name = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { name: 1 }, body: {} });
        const res_name = httpMocks.createResponse();
        (0, routes_1.save)(req_name, res_name);
        assert.strictEqual(res_name._getStatusCode(), 400);
        (0, routes_1.resetForTesting)();
        //Second subdomain: Body is not passed as a parameter
        const req_body1 = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { name: "bob" }, body: {} });
        const res_body1 = httpMocks.createResponse();
        (0, routes_1.save)(req_body1, res_body1);
        assert.strictEqual(res_body1._getStatusCode(), 400);
        (0, routes_1.resetForTesting)();
        const req_body2 = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { name: "William" }, body: {} });
        const res_body2 = httpMocks.createResponse();
        (0, routes_1.save)(req_body2, res_body2);
        assert.strictEqual(res_body2._getStatusCode(), 400);
        (0, routes_1.resetForTesting)();
        //Third Subdomain: Name and body are both passed in.
        //Only testing for a correct status code, as we will test the contents in
        //the tests for "load".
        const req_success1 = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { name: 'William' }, body: { data: 'Fang' } });
        const res_success1 = httpMocks.createResponse();
        (0, routes_1.save)(req_success1, res_success1);
        assert.strictEqual(res_success1._getStatusCode(), 200);
        (0, routes_1.resetForTesting)();
        const req_success2 = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { name: 'CSE' }, body: { data: '331' } });
        const res_success2 = httpMocks.createResponse();
        (0, routes_1.save)(req_success2, res_success2);
        assert.strictEqual(res_success2._getStatusCode(), 200);
        (0, routes_1.resetForTesting)();
    });
    it('load', function () {
        //First subdomian: Name is not passed as a parameter, or is not a string.
        //Only one possible no name
        const req0 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: {} });
        const res0 = httpMocks.createResponse();
        (0, routes_1.load)(req0, res0);
        assert.strictEqual(res0._getStatusCode(), 400);
        (0, routes_1.resetForTesting)();
        //Two tests for name not being a string
        const req_name = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: 1 } });
        const res_name = httpMocks.createResponse();
        (0, routes_1.load)(req_name, res_name);
        assert.strictEqual(res_name._getStatusCode(), 400);
        (0, routes_1.resetForTesting)();
        const req_name1 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: [0] } });
        const res_name1 = httpMocks.createResponse();
        (0, routes_1.load)(req_name1, res_name1);
        assert.strictEqual(res_name._getStatusCode(), 400);
        (0, routes_1.resetForTesting)();
        //Second subdomain: There is no saved file under that name.
        const req_body1 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: 'anything' } });
        const res_body1 = httpMocks.createResponse();
        (0, routes_1.load)(req_body1, res_body1);
        assert.strictEqual(res_body1._getStatusCode(), 404);
        (0, routes_1.resetForTesting)();
        const req_body2 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: "nada" } });
        const res_body2 = httpMocks.createResponse();
        (0, routes_1.load)(req_body2, res_body2);
        assert.strictEqual(res_body2._getStatusCode(), 404);
        (0, routes_1.resetForTesting)();
        //Third Subdomain: We get the file back succesfully
        const req_save_success1 = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { name: 'CSE' }, body: { data: '331' } });
        const res_save_success1 = httpMocks.createResponse();
        (0, routes_1.save)(req_save_success1, res_save_success1);
        const req_load_success1 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: "CSE" } });
        const res_load_success1 = httpMocks.createResponse();
        (0, routes_1.load)(req_load_success1, res_load_success1);
        assert.strictEqual(res_load_success1._getStatusCode(), 200);
        assert.deepEqual(res_load_success1._getData(), { data: '331' });
        (0, routes_1.resetForTesting)();
        const req_save_success2 = httpMocks.createRequest({ method: 'POST', url: '/api/save', query: { name: 'William' }, body: { data: 'Fang wrote this' } });
        const res_save_success2 = httpMocks.createResponse();
        (0, routes_1.save)(req_save_success2, res_save_success2);
        const req_load_success2 = httpMocks.createRequest({ method: 'GET', url: '/api/load', query: { name: "William" } });
        const res_load_success2 = httpMocks.createResponse();
        (0, routes_1.load)(req_load_success2, res_load_success2);
        assert.strictEqual(res_load_success2._getStatusCode(), 200);
        assert.deepEqual(res_load_success2._getData(), { data: 'Fang wrote this' });
        (0, routes_1.resetForTesting)();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGVzX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtDQUFpQztBQUNqQywyREFBNkM7QUFDN0MscUNBQW1GO0FBR25GLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFDakIsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUNULHlFQUF5RTtRQUN6RSxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDNUMsTUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzdDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBQSxhQUFJLEVBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRXhELE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQ3ZDLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUMsRUFBRSxJQUFJLEVBQUMsRUFBQyxJQUFJLEVBQUMsTUFBTSxFQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ25GLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUM3QyxJQUFBLGFBQUksRUFBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFFM0IsSUFBQSxhQUFJLEVBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFBO1FBRTFCLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUMsQ0FBQyxDQUFDO1FBRTVELE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQ3ZDLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUMs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