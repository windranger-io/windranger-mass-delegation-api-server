export const votingPowerRequest1 = `{
"options":     {
        "api": "https://test-url.for-snapshot.com:8000",
        "symbol": "BIT",
        "decimals": 0
        },
"network": "1",
"addresses": [
    "0x287c1b65992aAC3Ff67aDE9FeB9F3A73289E7277",
    "0x4F6b3B68Fde374aA0B14967E52CF3443Af5Dd3a5",
    "0xA78905e37CE42CE51D906b7A277363993Abb4598",
    "0xdec37483304e47566C3Bf1d691c1c5AdD631231d"
],
"snapshot": 11425892
}
`

export const votingPowerResponse1 = `{
"score": [
    {
    "address": "0x287c1b65992aAC3Ff67aDE9FeB9F3A73289E7277",
    "score": 9000000000
    },
    {
    "address": "0x4F6b3B68Fde374aA0B14967E52CF3443Af5Dd3a5",
    "score": 0
    },
    {
    "address": "0xA78905e37CE42CE51D906b7A277363993Abb4598",
    "score": 1000000000
    },
    {
        "address": "0xdec37483304e47566C3Bf1d691c1c5AdD631231d",
        "score": 500000
        }
    ]
}`

export const votingPowerResponse2 = `{
    "score": [
        {
        "address": "0x287c1b65992aAC3Ff67aDE9FeB9F3A73289E7277",
        "score": 9000000000
        },
        {
        "address": "0x4F6b3B68Fde374aA0B14967E52CF3443Af5Dd3a5",
        "score": 0
        },
        {
        "address": "0xA78905e37CE42CE51D906b7A277363993Abb4598",
        "score": 1000000000
        },
        {
            "address": "0xdec37483304e47566C3Bf1d691c1c5AdD631231d",
            "score": 500000
            }
        ]
    }`

export const massDelegateRequest1 = `{
    "content": {
      "network": "1",
      "delegator": "0xdededededededededededededededededededede",
      "delegatees": [
              {
                  "address" : "0xdededededededededededededededededededede",
                  "weight" : "5"
              },
              {
                  "address" : "0xd649bACfF66f1C85618c5376ee4F38e43eE53b63",
                  "weight" : "1"
              },
              {
                  "address" : "0xEA2E9cEcDFF8bbfF107a349aDB9Ad0bd7b08a7B7",
                  "weight" : "4"
              }
      ],
      "total_weight" : "100",
      "snapshot": 11425892
    }, 
    "permit" : "SIGNATURE TO BE INCLUDED"
  }
`

export const massDelegateResponse1 = `{
    "status": "ok",
    "blockNumber": 11425892,
    "delegator": "0xdededededededededededededededededededede",
    "numberOfDelegatees": "3"
}`

export const massDelegateRequest2 = `{
    "content": {
      "network": "1",
      "delegator": "0x287c1b65992aAC3Ff67aDE9FeB9F3A73289E7277",
      "delegatees": [
              {
                  "address" : "0xdededededededededededededededededededede",
                  "weight" : "5"
              },
              {
                  "address" : "0xd649bACfF66f1C85618c5376ee4F38e43eE53b63",
                  "weight" : "1"
              },
              {
                  "address" : "0xEA2E9cEcDFF8bbfF107a349aDB9Ad0bd7b08a7B7",
                  "weight" : "4"
              }
      ],
      "total_weight" : "100",
      "snapshot": 11425892
    }, 
    "permit" : "SIGNATURE TO BE INCLUDED"
  }
`

export const massDelegateResponse2 = `{
    "status": "ok",
    "blockNumber": 11425892,
    "delegator": "0xdededededededededededededededededededede",
    "numberOfDelegatees": "3"
}`
