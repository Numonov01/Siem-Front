export type EventDescriptor = {
  Id: number;
  Version: number;
  Channel: number;
  Level: number;
  Opcode: number;
  Task: number;
  Keyword: string;
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

export type EventData = {
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

export type NetworkEvent = {
  EventId: number;
  Event: EventData;
  id: string;
};

export type NetworkEventResponse = {
  count: number;
  page: number;
  page_size: number;
  results: NetworkEvent[];
};
