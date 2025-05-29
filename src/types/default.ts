export type BarData = {
  id: number;
  tag: string;
  log_count: number;
};

// export interface MismatchesResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: {
//     id: number;
//     log_id: string;
//     device_name: string;
//     rule: {
//       id: string;
//       title: string;
//       level: string;
//     };
//   }[];
// }

export interface Rule {
  id: string;
  title: string;
  level: string;
}

export interface MismatchesItem {
  id: number;
  log_id: string;
  device_name: string;
  rule: Rule;
}

export interface MismatchesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: MismatchesItem[];
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

export type MismatchesLevelChart = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
};
