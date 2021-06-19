export interface WhaleAlert {
  result: string;
  cursor: string;
  count: number;
  transactions?: (TransactionsEntity)[] | null;
}

export interface TransactionsEntity {
  blockchain: string;
  symbol: string;
  transaction_type: string;
  hash: string;
  from: From;
  to: To;
  timestamp: number;
  amount: number;
  amount_usd: number;
  transaction_count: number;
}

export interface From {
  address: string;
  owner: string;
  owner_type: string;
}

export interface To {
  address: string;
  owner: string;
  owner_type: string;
}
