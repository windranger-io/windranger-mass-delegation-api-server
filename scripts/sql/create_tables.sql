-- Delegatees are account that receive delegation of voting power from Delegators
CREATE TABLE delegation
(
    delegator_address CHAR(20),
    delegatee_address CHAR(20),
    proof             TEXT,
    delegated_weight  BIGINT,
    delegated_block   BIGINT,
    PRIMARY KEY (delegator_address,
                 delegatee_address)
);
CREATE INDEX delegation_index_delegator
    ON delegation (
                   delegator_address
        );
CREATE INDEX delegation_index_delegatee
    ON delegation (
                   delegatee_address
        );

-- Delegators delegate their voting power to Delegatees
CREATE TABLE delegators
(
    delegator_address CHAR(20) PRIMARY KEY,
    trie_root         CHAR(32),
    delegated_block   BIGINT
);

-- The single supported token's address, with support for contract migration
CREATE TABLE token
(
    contract_address        CHAR(20) PRIMARY KEY,
    delegation_from_block   BIGINT,
    delegated_to_block      BIGINT
);
