import {expect} from 'chai'
import {handler} from '../src/handler'

describe('Lambda function', () => {
    it('should return with programming cliché', async () => {
        const result = await handler()
        expect(result).equals('Hello world')
    })
})
