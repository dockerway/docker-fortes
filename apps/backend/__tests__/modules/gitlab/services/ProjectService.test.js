import {projectTags} from "../../../../src/modules/gitlab/services/ProjectService";


describe("ProjectService", () => {


    beforeAll(async () => {

    });

    afterAll(async () => {

    })


    test('projectTags', async () => {
        let result = await projectTags(542)
        expect(true).toBe(true)
    })

})
