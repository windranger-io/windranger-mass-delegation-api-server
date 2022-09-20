export const votingPowerRequest1 = `{
"options":     {
        "api": "https://test-url.for-snapshot.com:8000",
        "symbol": "BIT",
        "decimals": 0
        },
"network": "1",
"addresses": [
    "0xEA2E9cEcDFF8bbfF107a349aDB9Ad0bd7b08a7B7",
    "0x3c4B8C52Ed4c29eE402D9c91FfAe1Db2BAdd228D",
    "0xd649bACfF66f1C85618c5376ee4F38e43eE53b63"
],
"snapshot": 11437846
}
`

export const votingPowerResponse1 = `{
"score": [
    {
    "address": "0xEA2E9cEcDFF8bbfF107a349aDB9Ad0bd7b08a7B7",
    "score": 1
    },
    {
    "address": "0x3c4B8C52Ed4c29eE402D9c91FfAe1Db2BAdd228D",
    "score": 1
    },
    {
    "address": "0xd649bACfF66f1C85618c5376ee4F38e43eE53b63",
    "score": 1
}]
}`
