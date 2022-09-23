# windranger-mass-delegation-api-server
Managing the delegation of voting power between addresses and provides querying of an address' voting power.


## Install, build and run

Start by cloning the git repo locally.

#### Install

To retrieve the project dependencies and before any further tasks will run correctly.

```shell
npm ci
```

#### PostgresQL
To run the tests locally, in addition to the checked out code you'll also need an install of Postgres.

MacOS can easily use Homebrew
```shell
brew install postgres
```

Role for tests
```shell
psql postgres

CREATE ROLE unit_test_user 
LOGIN
CREATEDB 
PASSWORD 'unit-test-p@ssw0rd';
```


Start the Postgres service
```shell
brew services start postgres
```

Stop the Postgres service
```shell
brew services stop postgres
```


#### Husky Git Commit Hooks

To enable Husky commit hooks to trigger the lint-staged behaviour of formatting and linting the staged files prior
before committing, prepare your repo with `prepare`.

```shell
npm run prepare
```

#### Build and Test

```shell
npm run build
npm test
```

If you make changes that don't get picked up then add a clean into the process

```shell
npm run clean
npm run build
npm test
```

