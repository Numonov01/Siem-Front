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
