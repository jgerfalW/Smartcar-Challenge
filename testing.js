const test = require('tape');
const request = require('supertest');
const app = require('./app.js');


/**
 * Brief: This file extensively tests the various functions written in this project. It also performs GET/POST requests for a supertest instance.
 * Please ensure that this local supertest instance is running before executing all test cases. 
 * You can do so by executing: 
 * `nodemon testing.js`
 * 
 * Author: Joe Gerfal.
 * 
 * Date: Oct 2nd, 2022.
 */


// Base URL
const baseUrl = "http://localhost:5050";

// Object that mock relevant data coming from the GM API
let car1234 = {
    vin: "123123412412",
    color: "Metallic Silver",
    doorCount: 4,
    driveTrain: "v8"
};

// Object that mock relevant data coming from the GM API
let car1235 = {
    vin: "1235AZ91XP",
    color: "Forest Green",
    doorCount: 2,
    driveTrain: "electric"
};


// A testing function to test invalid vehicle ID (4321).
test('Invalid id handled correctly (404)', function(t) {
    request(baseUrl)
        .get('/vehicles/4321')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res) {
            t.error(err, 'No error');
            let notFound = res.body.hasOwnProperty('errMsg') && res.status == 404;
            t.ok(notFound, '404 on invalid id');
            t.end();
        });
});


// A testing function to test valid vehicle ID (1234).
test('Valid id returns all required fields for car 1234', function(t) {
    request(baseUrl)
        .get('/vehicles/1234')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'No error');
            t.deepEquals(res.body, car1234, 'Info API returns expected car attributes.');
            t.end();
        });
});


// A testing function to test valid vehicle ID (1235).
test('Valid id returns all required fields for car 1235', function(t) {
    request(baseUrl)
        .get('/vehicles/1235')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'No error');
            t.deepEquals(res.body, car1235, 'Info API returns expected car attributes.');
            t.end();
        });
});


// A testing function to test vehicle doors using Vehicle ID (1234).
test('Right set of doors is returned for car 1234', function(t) {
    request(baseUrl)
        .get('/vehicles/1234/doors')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'No error');

            // NOTE: Doors can be opened or closed at any time, therefore can only test for attributes.
            // All tests only pass if all doors are found.
            t.ok(res.body[0].location == 'frontLeft' || res.body[1].location == 'frontLeft', 'Car has frontLeft door');
            t.ok(res.body[0].location == 'frontRight' || res.body[1].location == 'frontRight', 'Car has frontRight door');
            t.ok(res.body[2].location == 'backLeft' || res.body[3].location == 'backLeft', 'Car has backLeft door');
            t.ok(res.body[2].location == 'backRight' || res.body[3].location == 'backRight', 'Car has backRight door');
            t.equals(typeof res.body[0].locked, 'boolean', 'Door locked status is a boolean');
            t.equals(typeof res.body[1].locked, 'boolean', 'Door locked status is a boolean');
            t.equals(typeof res.body[2].locked, 'boolean', 'Door locked status is a boolean');
            t.equals(typeof res.body[3].locked, 'boolean', 'Door locked status is a boolean');
            t.end();
        });
});


// A testing function to test vehicle doors using Vehicle ID (1235).
test('Right set of doors is returned for car 1235', function(t) {
    request(baseUrl)
        .get('/vehicles/1235/doors')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'No error');
            t.ok(res.body[0].location == 'frontLeft' || res.body[1].location == 'frontLeft', 'Car has frontLeft door');
            t.ok(res.body[0].location == 'frontRight' || res.body[1].location == 'frontRight', 'Car has frontRight door');
            t.equals(typeof res.body[0].locked, 'boolean', 'Door locked status is a boolean');
            t.equals(typeof res.body[1].locked, 'boolean', 'Door locked status is a boolean');
            t.end();
        });
});


// A testing function to test vehicle fuel range using Vehicle ID (1234).
test('Fuel level is returned properly for car 1234', function(t) {
    request(baseUrl)
        .get('/vehicles/1234/fuel')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'No error');
            t.ok(res.body.hasOwnProperty('percent'), 'API returns fuel percentage'); // percent is variable here, cannot test
            t.equals(typeof res.body.percent, 'number', 'API returns fuel percentage'); // can only test for type and existence
            t.end();
        });
});


// A testing function to test vehicle battery range using Vehicle ID (1234).
test('Battery level is returned properly for car 1234', function(t) {
    request(baseUrl)
        .get('/vehicles/1234/battery')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res) {
            t.error(err, 'No error');
            t.ok(res.body.percent == null, 'API returns NaN when battery is called on gas-powered car');
            t.end();
        });
});


// A testing function to test vehicle battery range using Vehicle ID (1235).
test('Battery level is returned properly for car 1235', function(t) {
    request(baseUrl)
        .get('/vehicles/1235/battery')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'No error');
            t.ok(res.body.hasOwnProperty('percent'), 'API returns battery percentage');
            t.equals(typeof res.body.percent, 'number', 'API returns fuel percentage');
            t.end();
        });
});


// A testing function to test vehicle fuel range using Vehicle ID (1235).
test('Fuel level is returned properly for car 1235', function(t) {
    request(baseUrl)
        .get('/vehicles/1235/fuel')
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res) {
            t.error(err, 'No error');
            t.ok(res.body.percent == null, 'API returns NaN when fuel is called on electric car');
            t.end();
        });
});


// A testing function to test vehicle engine action (START) using Vehicle ID (1234).
test('Start engine returns correct attribute for car 1234', function(t) {
    request(baseUrl)
        .post('/vehicles/1234/engine')
        .send({
            action: 'START'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'No error');

            // NOTE: Start seem to have a small chance of failing on either car, so check only for correct attributes.
            t.ok(res.body.hasOwnProperty('status'), 'API return error message');
            t.equals(typeof res.body.status, 'string', 'Engine (start|stop) status is a string');
            t.end();
        });
});


// A testing function to test vehicle engine action (STOP) using Vehicle ID (1234).
test('Stop engine returns correct attribute for car 1234', function(t) {
    request(baseUrl)
        .post('/vehicles/1234/engine')
        .send({
            action: 'STOP'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'No error');

            // NOTE: Stop seem to have a small chance of failing on either car, so check only for correct attributes
            t.ok(res.body.hasOwnProperty('status'), 'API return error message');
            t.equals(typeof res.body.status, 'string', 'Engine (start|stop) status is a string');
            t.end();
        });
});


// A testing function to test vehicle engine action (START) using Vehicle ID (1235).
test('Start engine returns correct attribute for car 1235', function(t) {
    request(baseUrl)
        .post('/vehicles/1235/engine')
        .send({
            action: 'START'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'No error');

            // NOTE: Start seem to have a small chance of failing on either car, so check only for correct attributes
            t.ok(res.body.hasOwnProperty('status'), 'API return error message');
            t.equals(typeof res.body.status, 'string', 'Engine (start|stop) status is a string');
            t.end();
        });
});


// A testing function to test vehicle engine action (STOP) using Vehicle ID (1235).
test('Stop engine returns correct attribute for car 1235', function(t) {
    request(baseUrl)
        .post('/vehicles/1235/engine')
        .send({
            action: 'STOP'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
            t.error(err, 'No error');

            // NOTE: Stop seem to have a small chance of failing on either car, so check only for correct attributes
            t.ok(res.body.hasOwnProperty('status'), 'API return error message');
            t.equals(typeof res.body.status, 'string', 'Engine (start|stop) status is a string');
            t.end();
        });
});