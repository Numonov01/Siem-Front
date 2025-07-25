// Chart data types

export type LogData = {
  tag_id: number;
  tag: string;
  log_count: number;
  logs: LogItem[];
};

export type LogItem = {
  id: string;
  EventId: number;
  Event: EventDetails;
};

export type EventDetails = {
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
};

export type EventHeader = {
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
};

export type EventDescriptor = {
  Id: number;
  Version: number;
  Channel: number;
  Level: number;
  Opcode: number;
  Task: number;
  Keyword: string;
};
