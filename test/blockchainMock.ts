export const getCombinedVotingPowerOfMock = async (
    walletAddress: string,
    _blockNumber: number
): Promise<number> =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    new Promise<number>((resolve, _reject) => {
        if (walletAddress === '0x287c1b65992aAC3Ff67aDE9FeB9F3A73289E7277') {
            resolve(9000000000)
        } else if (
            walletAddress === '0x4F6b3B68Fde374aA0B14967E52CF3443Af5Dd3a5'
        ) {
            resolve(0)
        } else if (
            walletAddress === '0xA78905e37CE42CE51D906b7A277363993Abb4598'
        ) {
            resolve(1000000000)
        } else if (
            walletAddress === '0xdec37483304e47566C3Bf1d691c1c5AdD631231d'
        ) {
            resolve(500000)
        }
        resolve(0)
    })
