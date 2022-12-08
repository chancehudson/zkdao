// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import { Unirep } from "@unirep/contracts/Unirep.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract ZKDAO {
    Unirep public unirep;

    address immutable operator;

    enum ProposalType {
      signup,
      spend
    }

    struct Proposal {
      ProposalType _type;
      address recipient;
      uint256 amount;
      uint256 index;
      uint256 semaphorePubkey;
      uint128 votesFor;
      uint128 votesAgainst;
      uint256 quorum;
      uint256 epoch;
      uint256 descriptionHash;
    }

    // track the proposal numbers
    uint256 proposalIndex = 0;

    mapping (uint256 => bool) public pendingSemaphorePubkeys;
    mapping (uint256 => bool) public approvedSemaphorePubkeys;

    mapping (uint256 => Proposal) public proposalsByIndex;
    mapping (uint256 => bool) public proposalHasExecuted;
    // proposal index => epoch key => bool
    mapping (uint256 => mapping(uint256 => bool)) epochKeyVotedForProposal;

    event NewProposal(uint256 indexed index, Proposal proposal);
    event ProposalVote(uint256 indexed index, bool isFor, uint epochKey);
    event ProposalExecuted(uint256 indexed index);

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
        if (unirep.attesterMemberCount(uint160(address(this))) == 0) {
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
      Unirep.EpochKeySignals memory signals = unirep.decodeEpochKeySignals(publicSignals);
      require(signals.epoch == unirep.attesterCurrentEpoch(uint160(address(this))));
      require(signals.attesterId == uint256(uint160(address(this))));
      unirep.submitAttestation(
        signals.epoch,
        signals.epochKey,
        msg.value,
        0,
        0
      );
    }

    // proposal functions
    // H(pubkey, H(description))
    function proposeSignUp(uint256 semaphorePubkey, uint256 descriptionHash) public payable {
      require(pendingSemaphorePubkeys[semaphorePubkey] == false);
      uint256 epoch = unirep.attesterCurrentEpoch(uint160(address(this)));
      uint256 index = proposalIndex++;
      Proposal memory proposal = Proposal({
        _type: ProposalType.signup,
        recipient: address(0),
        amount: 0,
        index: index,
        semaphorePubkey: semaphorePubkey,
        votesFor: 0,
        votesAgainst: 0,
        epoch: epoch,
        quorum: (unirep.attesterMemberCount(uint160(address(this))) + 1)/2,
        descriptionHash: descriptionHash
      });
      proposalsByIndex[index] = proposal;
      emit NewProposal(index, proposal);
    }

    // take an epoch key signing the proposal data
    function proposeSpend(
      address recipient,
      uint256 amount,
      uint256 descriptionHash
    ) public {
      uint256 epoch = unirep.attesterCurrentEpoch(uint160(address(this)));
      uint256 index = proposalIndex++;
      Proposal memory proposal = Proposal({
        _type: ProposalType.spend,
        recipient: recipient,
        amount: amount,
        index: index,
        semaphorePubkey: 0,
        votesFor: 0,
        votesAgainst: 0,
        epoch: epoch,
        quorum: (unirep.attesterMemberCount(uint160(address(this))) + 1)/2,
        descriptionHash: descriptionHash
      });
      proposalsByIndex[index] = proposal;
      emit NewProposal(index, proposal);
    }

    function vote(
      uint256[] memory publicSignals,
      uint256[8] memory proof
    ) public {
      unirep.verifyEpochKeyProof(publicSignals, proof);
      Unirep.EpochKeySignals memory signals = unirep.decodeEpochKeySignals(publicSignals);
      require(signals.epoch == unirep.attesterCurrentEpoch(uint160(address(this))), 'badepoch');
      require(signals.attesterId == uint256(uint160(address(this))));
      require(signals.revealNonce == 1, 'nonce');

      bool isFor = (signals.data & 1) == 1;
      // proposalIndex = data >> 1
      uint256 index = (signals.data >> 1);
      require(signals.nonce == index % unirep.numEpochKeyNoncePerEpoch(), 'wrongnonce');
      require(!epochKeyVotedForProposal[index][signals.epochKey], 'doublevote');
      epochKeyVotedForProposal[index][signals.epochKey] = true;
      if (isFor) {
        proposalsByIndex[index].votesFor++;
      } else {
        proposalsByIndex[index].votesAgainst++;
      }
      emit ProposalVote(index, isFor, signals.epochKey);
    }

    function executeProposal(uint256 index) public {
      require(!proposalHasExecuted[index], 'double');
      proposalHasExecuted[index] = true;
      Proposal storage proposal = proposalsByIndex[index];
      require(proposal.votesFor + proposal.votesAgainst >= proposal.quorum, 'quorum');
      require(proposal.votesFor > proposal.votesAgainst, 'votes');
      require(unirep.attesterCurrentEpoch(uint160(address(this))) > proposal.epoch, 'epoch');
      if (proposal._type == ProposalType.signup) {
        approvedSemaphorePubkeys[proposal.semaphorePubkey] = true;
      } else if (proposal._type == ProposalType.spend) {
        address payable recipient = payable(proposal.recipient);
        // recipient.transfer(proposal.amount);
      }
      emit ProposalExecuted(index);
    }
}
