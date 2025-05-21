export interface ProcessListData {
  id: number;
  created_at: string;
  updated_at: string;
  pid: number;
  title: string;
  exe: string;
  cmdline: string[];
  cwd: string | null;
  ppid: number;
  create_time: string;
  process_type: 'installed' | string;
  device: number;
  parent: number;
}
