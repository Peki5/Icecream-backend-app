const request = require('supertest');
const app = require('../app');

describe('Ice Cream Shop API', () => {
    afterAll(done => {
        app.close(done);
    });

    it('should initially have no flavors', async () => {
        const res = await request(app).get('/api/flavors');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toEqual(0);
    });

    describe.each([
        ['chocolate', 1],
        ['vanilla', 2],
    ])('Flavor tests for %s', (flavor, id) => {
        it('should add a new flavor correctly', async () => {
            const res = await request(app).post('/api/flavors').send({ flavor });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('flavor', flavor);
            expect(res.body).toHaveProperty('id', id);
        });
    
        it('should retrieve the added flavor', async () => {
            const res = await request(app).get(`/api/flavors/${id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('flavor', flavor);
        });
    
        it('should update the flavor correctly', async () => {
            const updatedFlavor = 'updated ' + flavor;
            const res = await request(app).put(`/api/flavors/${id}`).send({ flavor: updatedFlavor });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('flavor', updatedFlavor);
            expect(res.body).toHaveProperty('id', id);
        });
    
        it('should retrieve the updated flavor', async () => {
            const res = await request(app).get(`/api/flavors/${id}`);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('flavor', 'updated ' + flavor);
        });
    
        it('should delete the flavor correctly', async () => {
            const res = await request(app).delete(`/api/flavors/${id}`);
            expect(res.statusCode).toEqual(204);
        });
    
        it('should return 404 for the deleted flavor', async () => {
            const res = await request(app).get(`/api/flavors/${id}`);
            expect(res.statusCode).toEqual(404);
        });
    });

    it('should have no flavors after deleting all elements', async () => {
        const res = await request(app).get('/api/flavors');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toEqual(0);
    });


    it('should add multiple flavors correctly (chocolate, bourbon vanilla, strawberry)', async () => {
        const flavors = ['chocolate', 'bourbon vanilla', 'strawberry'];
        for (let flavor of flavors) {
            const res = await request(app).post('/api/flavors').send({ flavor });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('flavor', flavor);
        }
    });

    it('should retrieve all flavors (chocolate, bourbon vanilla, strawberry) with correct structure', async () => {
        const res = await request(app).get('/api/flavors');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        res.body.forEach(flavor => {
            expect(flavor).toMatchObject({
                id: expect.any(Number),
                flavor: expect.any(String)
            });
        });
    });

    it('should retrieve all flavors (chocolate, bourbon vanilla, strawberry)', async () => {
        const res = await request(app).get('/api/flavors');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toEqual(3);
        expect(res.body[0]).toHaveProperty('flavor', 'chocolate');
        expect(res.body[0]).toHaveProperty('id', 3);
        expect(res.body[1]).toHaveProperty('flavor', 'bourbon vanilla');
        expect(res.body[1]).toHaveProperty('id', 4);
        expect(res.body[2]).toHaveProperty('flavor', 'strawberry');
        expect(res.body[2]).toHaveProperty('id', 5);
    });

    it('should update the strawberry flavor to orange correctly', async () => {
        const updatedFlavor = 'orange';
        const res = await request(app).put('/api/flavors/5').send({ flavor: updatedFlavor });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('flavor', updatedFlavor);
        expect(res.body).toHaveProperty('id', 5);
    });

    it('should retrieve the updated strawberry to orange flavor', async () => {
        const res = await request(app).get('/api/flavors/5');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('flavor', 'orange');
        expect(res.body).toHaveProperty('id', 4);
    });

    it('should delete the orange flavor correctly', async () => {
        const res = await request(app).delete('/api/flavors/5');
        expect(res.statusCode).toEqual(200);
    });

    it('should return 404 for the deleted orange flavor', async () => {
        const res = await request(app).get('/api/flavors/5');
        expect(res.statusCode).toEqual(404);
    });

    it('should have 2 flavors after deleting one of the 3 added', async () => {
        const res = await request(app).get('/api/flavors');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toBeInstanceOf(Array);
        expect(res.body.length).toEqual(2);
    });

    it('should not add a flavor without a name', async () => {
        const res = await request(app).post('/api/flavors').send({});
        expect(res.statusCode).toEqual(400);
    });

    it('should not add a flavor with a name that already exists', async () => {
        const newFlavor = 'chocolate';
        const res = await request(app).post('/api/flavors').send({ flavor: newFlavor });
        expect(res.statusCode).toEqual(400);
    });

    it('should not update a flavor that does not exist', async () => {
        const updatedFlavor = 'vanilla';
        const res = await request(app).put('/api/flavors/9999').send({ flavor: updatedFlavor });
        expect(res.statusCode).toEqual(404);
    });

    it('should not delete a flavor that does not exist', async () => {
        const res = await request(app).delete('/api/flavors/9999');
        expect(res.statusCode).toEqual(404);
    });

    describe.each([
        ['empty string', ''],
        ['space', ' '],
        ['multiple spaces', '        '],
        ['tab', '\t'],
        ['newline', '\n'],
        ['string with special characters', '!@#$%^&*()'],
        ['string that is too long', 'a'.repeat(151)]
    ])('when flavor name is an invalid string (%s)', (description, flavor) => {
        it('should not create the new flavor with an invalid string', async () => {
            const res = await request(app).post('/api/flavors').send({ flavor });
            expect(res.statusCode).toEqual(400);
        });

        it('should not update the new flavor with an invalid string', async () => {
            const res = await request(app).put('/api/flavors/1').send({ flavor });
            expect(res.statusCode).toEqual(400);
        });
    });

    describe('Pagination and Filtering', () => {
        it('should return the first page of flavors', async () => {
            const res = await request(app).get('/api/flavors?page=1&limit=10');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBeLessThanOrEqual(10);
        });
    
        it('should return the second page of flavors', async () => {
            const res = await request(app).get('/api/flavors?page=2&limit=10');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBeLessThanOrEqual(10);
        });
    
        it('should filter flavors by name', async () => {
            const res = await request(app).get('/api/flavors?name=chocolate');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toBeInstanceOf(Array);
            res.body.forEach(flavor => {
                expect(flavor).toHaveProperty('flavor', 'chocolate');
            });
        });
    
        it('should return 404 for a page that does not exist', async () => {
            const res = await request(app).get('/api/flavors?page=9999');
            expect(res.statusCode).toEqual(404);
        });
    
        it('should return 400 for invalid page number', async () => {
            const res = await request(app).get('/api/flavors?page=abc');
            expect(res.statusCode).toEqual(400);
        });
    
        it('should return 400 for invalid limit number', async () => {
            const res = await request(app).get('/api/flavors?limit=abc');
            expect(res.statusCode).toEqual(400);
        });
    });
});