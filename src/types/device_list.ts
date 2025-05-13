export interface DeviceListData {
  pk: number;
  name: string;
  os_name: string;
  user: string;
  last_active: string;
  is_active: boolean;
  mac_address: string;
  ip_address: string;
}

export interface Application {
  id: number;
  title: string;
}

export interface Device {
  id: number;
  name: string;
  os_name: string;
  is_active: boolean;
  last_active: string;
  ip_address: string;
  user: string;
  mac_address: string;
  applications: Application[];
}
