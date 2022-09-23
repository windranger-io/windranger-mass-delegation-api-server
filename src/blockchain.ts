import {ethers} from 'ethers'
import * as abi from './abi'

/**
 * Shape of the AWS Gateway event the handler has available
 * https://github.com/awsdocs/aws-lambda-developer-guide/blob/main/sample-apps/nodejs-apig/event.json
 */

export const getPriorVotingPowerOf = async (
    walletAddress: string,
    blockNumber: number
): Promise<number> => {
    const provider = new ethers.providers.InfuraProvider(
        'rinkeby',
        'INFURA_KEY'
    )
    // RINKEBY COMP-like token
    const tokenContract: string =
        '0xCB198597184804f175Dc7b562b0b5AF0793e9176' as string
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const contract = new ethers.Contract(
        tokenContract,
        abi.compLikeABI,
        provider
    )
    const result: number = parseInt(
        ethers.utils.formatEther(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
            await contract.getPriorVotes(walletAddress, blockNumber)
        )
    )
    return result
}

export const getCombinedVotingPowerOf = async (
    walletAddress: string,
    blockNumber: number
): Promise<number> => {
    const provider = new ethers.providers.AlchemyProvider(
        'rinkeby',
        'ALCHEMY_KEY'
    )
    // RINKEBY COMP-like token
    const tokenContract: string =
        '0xCB198597184804f175Dc7b562b0b5AF0793e9176' as string
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const contract = new ethers.Contract(
        tokenContract,
        abi.compLikeABI,
        provider
    )
    let result = 0
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const delegatee: string = await contract.delegates(walletAddress)
    if (delegatee === ethers.constants.AddressZero) {
        result += parseInt(
            ethers.utils.formatEther(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
                await contract.balanceOf(walletAddress, {
                    blockTag: blockNumber
                })
            )
        )
    }
    result += parseInt(
        ethers.utils.formatEther(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument
            await contract.getPriorVotes(walletAddress, blockNumber)
        )
    )
    return result
}
