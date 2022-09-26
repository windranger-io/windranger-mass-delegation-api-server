import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from 'aws-lambda/trigger/api-gateway-proxy'
import {Context} from 'aws-lambda'
import {log} from '../../config/logging'
import {throwError} from '../error'
import {insertDelegateDb} from '../db/postgres'

function verifyTotalWeight(content: {
    totalWeight: string
    delegatees: any
}): number {
    if (parseInt(content.totalWeight) !== parseFloat(content.totalWeight)) {
        // raise error
        throwError('MassDelegate: total weight is invalid, is a floating point number.')
    }
    const total = parseInt(content.totalWeight)
    let sumW = 0
    for (let d of content.delegatees) {
        if (!(parseInt(d.weight) > 0 && parseInt(d.weight) === parseFloat(d.weight))) {
            throwError('MassDelegate: specific weight is 0 or not an integer.')
        }
        sumW += parseInt(d.weight)
    }
    if (total !== sumW) {
        throwError('MassDelegate: total weight is invalid, summing up the weights.')
    }
    return total
}

/**
 * Shape of the AWS Gateway event the handler has available
 * https://github.com/awsdocs/aws-lambda-developer-guide/blob/main/sample-apps/nodejs-apig/event.json
 */
export const handler = async (
    event: APIGatewayProxyEvent,
    context: Context
    // eslint-disable-next-line @typescript-eslint/require-await
): Promise<APIGatewayProxyResult> => {
    log.info(
        'massDelegation id: %s, name: %s',
        context.awsRequestId,
        context.functionName
    )

    const reqBody = event.body || ''

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    const content: {[id: string]: string | string[] | number | any} =
        JSON.parse(reqBody)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const delegateesLen = content.content.delegatees.length as number
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
    const networkNum: number = parseInt(content.content.network)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const govToken: string = content.content.governance_token as string
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const delegator: string = content.content.delegator as string
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const blockNumber: number = content.content.snapshot as number

    // verify total weight
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const totalWeight = verifyTotalWeight(content.content)

    //here, check signature from permit, signer=delegator
    
    // list of previous delegatees, each maybe has to be set
    // to zero if they are not delegatees now
    // prev_list = [dic['address'] for dic in self._delegators[delegator][-1]['delegatees'] ]

    // verify blockNumber is greater than previous mass-delegation blockNumber

    // append the new mass-delegation
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    for (const delegateeDict of content.content.delegatees) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const delegatee = delegateeDict.address as string
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const weight = parseInt(delegateeDict.weight)
        await insertDelegateDb(
            networkNum,
            govToken,
            delegator,
            delegatee,
            weight,
            totalWeight,
            blockNumber
        )
    }

    // # missing delegatees from prev list must get zero weight.
    // for prev_delegatee in prev_list:
    //     self._delegatees[prev_delegatee].append((block_number,delegator,0,total_weight))

    const resp = {
        status: 'ok',
        blockNumber,
        delegator,
        numberOfDelegatees: delegateesLen.toString()
    }
    return {
        statusCode: 200,
        body: JSON.stringify(resp)
    }
}
