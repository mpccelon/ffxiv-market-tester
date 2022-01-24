// setup env variables
require('dotenv').config({
    path: '../.env'
})

const chai = require('chai');
const expect = chai.expect;
const url = `http://localhost:` + process.env.SERVER_PORT;
const request = require('supertest')(url);

describe('User Creation', () => {
    it('Can Create A User', (done) => {
        request.post('/')
        .send({
            query: 'mutation Mutation($username: String!, $password: String!) {\n  createUser(username: $username, password: $password) {\n    token\n    user {\n      username\n      id\n    }\n  }\n}',
            variables: {
                username: String(Date.now()),
                password: 'test'
            }
        })
        .expect(200)
        .end((err, res) => {
            if (err) 
                return done(err);
            res_json = JSON.parse(res.text);
            console.log(res_json.errors);
            if (res_json.errors) 
                return done(res_json.errors[0].message);
            done();
        })
    });

    it('Can Login A User', (done) => {
        request.post('/')
        .send({
            query: 'mutation Mutation($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    token\n    user {\n      username\n      id\n    }\n  }\n}',
            variables: {
                username: 'test',
                password: 'test'
            }
        })
        .expect(200)
        .end((err, res) => {
            if (err) 
                return done(err);
            res_json = JSON.parse(res.text);
            console.log(res_json.errors);
            if (res_json.errors) 
                return done(res_json.errors[0].message);
            done();
        })
    });
});

describe('User Read/Update/Delete', () => {
    let authToken = null;
    before((done) => {
        request.post('/')
        .send({
            query: 'mutation Mutation($username: String!, $password: String!) {\n  login(username: $username, password: $password) {\n    token\n    user {\n      username\n      id\n    }\n  }\n}',
            variables: {
                username: 'test',
                password: 'test'
            }
        })
        .expect(200)
        .end((err, res) => {
            if (err) 
                return done(err);
            res_json = JSON.parse(res.text);
            try {
                authToken = res_json.data.login.token;
            } catch (error) {
                return done(error);
            }
            if (res_json.errors) 
                return done(res_json.errors[0].message);
            done();
        })
    });

    it('Can Fetch Users', (done) => {
        request.post('/')
        .set('Authorization', 'Bearer' + authToken)
        .send({
            query: 'query GetUsers { getUsers { id username } }',
        })
        .expect(200)
        .end((err, res) => {
            if (err) 
                return done(err);
            res_json = JSON.parse(res.text);
            // console.log(res_json.data.getUsers);
            if (res_json.errors) 
                return done(res_json.errors[0].message);
            done();
        })
    });

    it('Cannot Fetch Users without token', (done) => {
        request.post('/')
        .send({
            query: 'query GetUsers { getUsers { id username } }',
        })
        .expect(200)
        .end((err, res) => {
            if (err) 
                return done(err);
            res_json = JSON.parse(res.text);
            expect(res_json.errors[0].message).to.equal('You are not authenticated');
            done();
        })
    });
});