import {expect} from 'chai'
import {APIGatewayProxyEvent} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {mock, instance, when} from 'ts-mockito'
import {
    createMassDelegationDatabase,
    dropMassDelegationDatabase
} from '../../src/db/postgres'
import {handler as massDelegateHandler} from '../../src/handler/mass-delegation'
import {handler as getVotingPowerHandler} from '../../src/handler/get-voting-power'

import * as testData from '../testData'

describe('Mass Delegation Lambda', () => {
    before(async () => {
        await createMassDelegationDatabase()
    })

    after(async () => {
        await dropMassDelegationDatabase()
    })
    it('answers mass delegate', async () => {
        const event = mock<APIGatewayProxyEvent>()
        when(event.queryStringParameters).thenReturn({
            ['useMockedBlockchain']: 'true'
        })
        when(event.path).thenReturn('/mass-delegate')
        when(event.httpMethod).thenReturn('POST')

        const jsonStr: string = testData.massDelegateRequest0
        when(event.body).thenReturn(jsonStr)

        const context = mock<Context>()

        const result = await massDelegateHandler(
            instance(event),
            instance(context)
        )

        // TODO populate with test data for comparision!
        const expectedResponse = JSON.stringify(
            JSON.parse(testData.massDelegateResponse0)
        )
        expect(result).deep.equals({
            statusCode: 200,
            body: expectedResponse
        })
    })
    it('mass delegates to 2 addresses', async () => {
        const event = mock<APIGatewayProxyEvent>()
        when(event.queryStringParameters).thenReturn({
            ['useMockedBlockchain']: 'true'
        })

        // calling mass-delegate
        when(event.path).thenReturn('/mass-delegate')
        when(event.httpMethod).thenReturn('POST')
        let jsonStr: string = testData.massDelegateRequest1
        when(event.body).thenReturn(jsonStr)
        let context = mock<Context>()
        let result = await massDelegateHandler(
            instance(event),
            instance(context)
        )

        // calling mass-delegate
        when(event.path).thenReturn('/voting-power')
        when(event.httpMethod).thenReturn('GET')
        jsonStr = testData.votingPowerRequest1
        when(event.body).thenReturn(jsonStr)
        context = mock<Context>()
        result = await getVotingPowerHandler(instance(event), instance(context))

        // checking voting-power response
        const expectedResponse = JSON.stringify(
            JSON.parse(testData.votingPowerResponse2)
        )
        expect(result).deep.equals({
            statusCode: 200,
            body: expectedResponse
        })
    })
})
