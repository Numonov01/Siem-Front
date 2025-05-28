export type BarData = {
  id: number;
  tag: string;
  log_count: number;
};

interface Rule {
  id: string;
  title: string;
  level: 'high' | 'medium' | 'low';
}

interface MismatchResult {
  id: number;
  device_name: string;
  log_id: string;
  rule: Rule;
}

export interface MismatchesResponse {
  count: number;
  next: string;
  previous: string;
  results: MismatchResult[];
}

export type SigmaRule = {
  title: string;
  id: string;
  status: string;
  description: string;
  references: string[];
  author: string;
  date: string;
  modified: string;
  tags: string[];
  logsource: {
    category: string;
    product: string;
  };
  detection: {
    selection: {
      'CommandLine|contains|all': string[];
      'CommandLine|contains': string[];
    };
    condition: string;
  };
  falsepositives: string[];
  level: string;
  filename: string;
};
