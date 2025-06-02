export type BarData = {
  id: number;
  tag: string;
  log_count: number;
};

interface EventDescriptor {
  Id: number;
  Version: number;
  Channel: number;
  Level: number;
  Opcode: number;
  Task: number;
  Keyword: string;
}

interface EventHeader {
  Size: number;
  HeaderType: number;
  Flags: number;
  EventProperty: number;
  ThreadId: number;
  ProcessId: number;
  TimeStamp: number;
  ProviderId: string;
  EventDescriptor: EventDescriptor;
  KernelTime: number;
  UserTime: number;
  ActivityId: string;
}

interface Event {
  EventHeader: EventHeader;
  'Task Name': string;
  RuleName: string;
  UtcTime: string;
  ProcessGuid: string;
  ProcessId: string;
  Image: string;
  FileVersion: string;
  Description: string;
  Product: string;
  Company: string;
  OriginalFileName: string;
  CommandLine: string;
  CurrentDirectory: string;
  User: string;
  LogonGuid: string;
  LogonId: string;
  TerminalSessionId: number;
  IntegrityLevel: string;
  Hashes: string;
  ParentProcessGuid: string;
  ParentProcessId: string;
  ParentImage: string;
  ParentCommandLine: string;
  ParentUser: string;
}

interface Log {
  id: string;
  EventId: number;
  Event: Event;
}

export interface RootObject {
  tag_id: number;
  tag: string;
  log_count: number;
  logs: Log[];
}

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
