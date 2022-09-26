-- Delegatees are account that receive delegation of voting power from Delegators
CREATE TABLE delegation
(
    network          INT,
    token_address     CHAR(64),
    delegator_address CHAR(64),
    delegatee_address CHAR(64),
    proof             TEXT,
    delegated_weight  BIGINT,
    total_weight      BIGINT,
    delegated_block   BIGINT,
    PRIMARY KEY (
                network,
                token_address,
                delegator_address,
                delegatee_address,
                delegated_block)
);
CREATE INDEX delegation_index_delegator
    ON delegation (
                   network,
                   token_address,
                   delegator_address
        );

CREATE INDEX delegation_index_delegatee
    ON delegation (
                network,
                token_address,
                delegatee_address
        );

-- Delegators delegate their voting power to Delegatees
CREATE TABLE delegators
(
    network           INT, 
    token_address     CHAR(64),
    delegator_address CHAR(64),
    trie_root         CHAR(128),
    delegated_block   BIGINT,
    total_weight      INT,
    PRIMARY KEY (network, token_address, delegator_address)
);
