export interface DownlinkData {
  cmd: "tx";
  EUI: string;
  port: number;
  confirmed: false;
  data: string;
}
