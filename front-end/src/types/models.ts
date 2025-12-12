export interface ServiceModel {
  id: number;
  host_ipv4: string;
  name: string;
  port: number;
  protocol: string;
  state: "open" | "closed" | "filtered";
}

export interface HostModel {
  ipv4: string;
  state: "online" | "offline";
  services?: ServiceModel[];
}
