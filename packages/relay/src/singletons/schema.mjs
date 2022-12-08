import { schema } from '@unirep/core'

const _schema = [
  {
    name: 'AccountTransaction',
    primaryKey: 'signedData',
    rows: [
      ['signedData', 'String'],
      ['address', 'String'],
      ['nonce', 'Int']
    ]
  },
  {
    name: 'AccountNonce',
    primaryKey: 'address',
    rows: [
      ['address', 'String'],
      ['nonce', 'Int'],
    ],
  },
  {
    name: 'Proposal',
    primaryKey: 'index',
    rows: [
      ['index', 'String', { unique: true }],
      ['type', 'Int'],
      ['recipient', 'String'],
      ['amount', 'String'],
      ['semaphorePubkey', 'String'],
      ['votesFor', 'Int'],
      ['votesAgainst', 'Int'],
      ['quorum', 'String'],
      ['epoch', 'Int'],
      ['descriptionHash', 'String'],
      ['executed', 'Int', { optional: true }],
      {
        name: 'description',
        type: 'Object',
        relation: {
          localField: 'descriptionHash',
          foreignField: 'hash',
          foreignTable: 'ProposalDescription',
        },
      },
    ]
  },
  {
    name: 'ProposalDescription',
    primaryKey: 'hash',
    rows: [
      ['hash', 'String'],
      ['text', 'String']
    ]
  }
]

export default [...schema, ..._schema]
