export interface EventData {
  events: EventData[];
  event_id: string;
  utc_time: string;
  image: string;
  target_filename: string;
  parent_image: string;
  command_line: string;
  user: string;
  process_guid: string;
  process_id: string;
  parent_process_guid: string;
  parent_process_id: string;
  source_ip: string;
  source_port: number;
  destination_ip: string;
  destination_port: number;
  integrity_level: string;
  host_id: number;
  ingest_time: string;
  id: string;
}
