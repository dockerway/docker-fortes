import mongoInMemory from '../mongo-inmemory'
import initService from '../../src/init/init-service'


describe("template", () => {


    beforeAll(async () => {
        jest.setTimeout(10000)
        await mongoInMemory.connect()
        await initService()
    });

    afterAll(async () => {

    })


    test('template true', async () => {
        expect(true).toBe(true)
    })

})
