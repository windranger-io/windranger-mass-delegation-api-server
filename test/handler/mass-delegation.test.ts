import {expect} from 'chai'
import {APIGatewayProxyEvent} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {mock, instance, when} from 'ts-mockito'
import {
    createMassDelegationDatabase,
    dropMassDelegationDatabase
} from '../postgres'
import {handler} from '../../src/handler/mass-delegation'

describe('Mass Delegation Lambda', () => {
    before(async () => {
        await createMassDelegationDatabase()
    })

    after(async () => {
        await dropMassDelegationDatabase()
    })

    it('parses query parameters', async () => {
        const event = mock<APIGatewayProxyEvent>()
        when(event.queryStringParameters).thenReturn({
            ['tokenAddress']: 'one'
        })

        const context = mock<Context>()
        when(context.awsRequestId).thenReturn('199')
        when(context.functionName).thenReturn('The best getVotingPower ever!')

        const result = await handler(instance(event), instance(context))

        // TODO populate with test data for comparision!
        expect(result).deep.equals({
            statusCode: 200,
            body: 'Queries: '
        })
    })
})
