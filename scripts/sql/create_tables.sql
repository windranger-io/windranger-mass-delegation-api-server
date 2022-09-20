-- Delegatees are account that receive delegation of voting power from Delegators
CREATE TABLE delegation
(
    token_address     CHAR(20),
    delegator_address CHAR(20),
    delegatee_address CHAR(20),
    proof             TEXT,
    delegated_weight  BIGINT,
    delegated_block   BIGINT,
    PRIMARY KEY (token_address,
                 delegator_address,
                 delegatee_address)
);
CREATE INDEX delegation_index_delegator
    ON delegation (
                   token_address,
                   delegator_address
        );

CREATE INDEX delegation_index_delegatee
    ON delegation (
                   token_address,
                   delegatee_address
        );

-- Delegators delegate their voting power to Delegatees
CREATE TABLE delegators
(
    token_address     CHAR(20),
    delegator_address CHAR(20),
    trie_root         CHAR(32),
    delegated_block   BIGINT,
    PRIMARY KEY (token_address, delegator_address)
);
