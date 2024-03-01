describe('Package.json updates', () => {
    let packageJson;
    beforeAll(() => {
        packageJson = require('../package.json');
    });

    test('Username should be updated', () => {
        expect(packageJson.username).not.toBe('ADD_YOUR_USERNAME');
    });
})
