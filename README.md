# zkdao

Users may join the DAO by creating a proposal to add a semaphore identity to the unirep attester. This proposal must be voted on by a quorum of the current members, and the vote must be majority in favor.

Once a user has joined they may deposit into the DAO and receive positive reputation equal to the amount of wei deposited.

Users can make proposals to spend Ether from the DAO to Ethereum addresses. Users don't need to be members of the group to make such proposals.

A proposal may be executed in the epoch following it's creation, assuming it is ratified.

-- Other details

Positive rep = amount of wei contributed to the DAO
Negative rep = number of proposals voted on
Graffiti = unused

# Running the app

## 1. Installation

```shell
npx create-unirep-app
```

Then `cd` into the directory that was created.

## 2. Start a node

```shell
yarn contracts hardhat node
```

## 3. Deploy smart contracts

in new terminal window, from root:

```shell
yarn contracts deploy
```

## 4. Start a relayer (backend)

```shell
yarn relay keys &&
yarn relay start
```

## 5. Start a frontend

in new terminal window, from root:

```shell
yarn frontend start
```

It will be running at: http://localhost:3000/
