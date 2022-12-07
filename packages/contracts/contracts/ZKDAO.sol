// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import { Unirep } from "@unirep/contracts/Unirep.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ZKDAO {
    Unirep public unirep;

    address immutable operator:

    struct Proposal {
      uint256 type;

    }
    struct SignUpProposal {
      uint256 sempahorePubkey;
      uint128 votesFor;
      uint128 votesAgainst;
      uint256 epoch;
    }

    // 0.01 Ether
    uint256 baseVoteCount = 10000000000000000;
    // 0.0001 Ether
    uint256 voteCountChange = 100000000000000;

    mapping (uint256 => bool) public approvedSemaphorePubkeys;

    constructor(Unirep _unirep, uint256 _epochLength) {
        // set unirep address
        unirep = _unirep;

        // sign up as an attester
        unirep.attesterSignUp(_epochLength);
        operator = msg.sender;
    }

    // sign up users in this app
    function signUp(
        uint256[] memory publicSignals,
        uint256[8] memory proof
    ) public payable {
        if (unirep.attesterMemberCount(uint160(this)) == 0) {
          require(msg.sender == operator);
        } else {
          require(approvedSemaphorePubkeys[publicSignals[0]]);
          approvedSemaphorePubkeys[publicSignals[0]] = false;
        }
        unirep.userSignUp(publicSignals, proof);
    }

    function deposit(
      uint256[] memory publicSignals,
      uint256[8] memory proof
    ) public payable {
      unirep.verifyEpochKeyProof(publicSignals, proof);
      EpochKeySignals memory signals = unirep.decodeEpochKeySignals(publicSignals);
      require(signals.epoch == unirep.attesterCurrentEpoch(uint160(this)));
      require(signals.attesterId == uint256(this));
      unirep.submitAttestation(
        signals.epoch,
        signals.epochKey,
        msg.value,
        0,
        0
      );
    }

    // proposal functions

    function proposeSignUp(uint256 semaphorePubkey) public payable {
      // stub
    }

    // take an epoch key signing the proposal data
    function proposeSpend(
      uint256[] memory publicSignals,
      uint256[8] memory proof,

    ) public {

    }

    // The maximum number of votes a user can buy by depositing funds
    function maxVoteCount() public view returns (uint256) {
      return baseVoteCount + (unirep.attesterCurrentEpoch(uint160(this)) + voteCountChange);
    }

    // vote on a proposal
    // set min contribution amount and max contribution amount

    // halt the DAO and allow everyone to withdraw

    // 1 new member each epoch
    // vote on new member
    // majority must participate in vote

    // submit attestations
    function submitAttestation(
        uint256 targetEpoch,
        uint256 epochKey,
        uint256 posRep,
        uint256 negRep,
        uint256 graffiti
    ) public {
        unirep.submitAttestation(
            targetEpoch,
            epochKey,
            posRep,
            negRep,
            graffiti
        );
    }
}
