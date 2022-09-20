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

export const massDelegateRequest1 = `{
    "content": {
      "network": "1",
      "delegator": "0xdededededededededededededededededededede",
      "delegatees": [
              {
                  "address" : "0xdededededededededededededededededededede",
                  "weight" : "95"
              },
              {
                  "address" : "0xd649bACfF66f1C85618c5376ee4F38e43eE53b63",
                  "weight" : "3"
              },
              {
                  "address" : "0xEA2E9cEcDFF8bbfF107a349aDB9Ad0bd7b08a7B7",
                  "weight" : "2"
              }
      ],
      "total_weight" : "100",
      "snapshot": 11437846
    }, 
    "permit" : "SIGNATURE TO BE INCLUDED"
  }
`

export const massDelegateResponse1 = `{
    "status": "ok",
    "blockNumber": 11437846,
    "delegator": "0xdededededededededededededededededededede",
    "numberOfDelegatees": "3"
}`
