import {expect} from 'chai'
import {APIGatewayProxyEvent} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {mock, instance, when} from 'ts-mockito'
import {
    createMassDelegationDatabase,
    dropMassDelegationDatabase
} from '../postgres'
import {handler} from '../../src/handler/get-voting-power'
import * as testData from '../testData'

describe('Get Voting Power Lambda', () => {
    before(async () => {
        await createMassDelegationDatabase()
    })

    after(async () => {
        await dropMassDelegationDatabase()
    })
    it('answers voting power', async () => {
        const event = mock<APIGatewayProxyEvent>()
        when(event.queryStringParameters).thenReturn({
            ['useMockedBlockchain']: 'true'
        })
        when(event.path).thenReturn('/get-voting-power')
        when(event.httpMethod).thenReturn('GET')

        const jsonStr: string = testData.votingPowerRequest1
        when(event.body).thenReturn(jsonStr)

        const context = mock<Context>()
        when(context.awsRequestId).thenReturn('199')
        when(context.functionName).thenReturn('The best handler ever!')

        const result = await handler(instance(event), instance(context))

        const expectedResponse = JSON.stringify(
            JSON.parse(testData.votingPowerResponse1)
        )
        expect(result).deep.equals({
            statusCode: 200,
            body: expectedResponse
        })
    })
})
