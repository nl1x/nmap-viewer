import * as fs from 'fs';

interface ServiceState {
  port: number;
  protocol: string;
  state: 'open' | 'closed' | 'filtered';
  name: string;
}

export interface HostState {
  ipv4: string;
  state: 'online' | 'offline';
  services: ServiceState[];
}

export class NmapParser {

  static ipToAddress(ipv4: string): number {
    const bits: number[] = ipv4.split('.').map((bit) => Number(bit));
    let num = 0;
    let i = bits.length - 1;

    for (const bit of bits) {
      num += Math.pow(256, i) * bit;
      i--;
    }
    return num;
  }

  static parse(filePath: string): HostState[] {
    const hosts: HostState[] = [];
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines: string[] = fileContent.split('\n');

    for (let i = 0; i < lines.length; i += 1) {
      const line = lines.at(i);

      if (line === undefined) break;

      if (line.includes('Nmap scan report for ')) {
        const host = NmapParser._retrieveHost(line);
        if (!host) continue;

        const isUp: boolean = NmapParser._isHostUp(line);

        if (!isUp) {
          hosts.push({ipv4: host, services: [], state: 'offline'});
        } else {
          const { services, nextLine } = NmapParser._retrieveOpenedPorts(host, lines, i);
          hosts.push({ ipv4: host, services: services, state: 'online' });
          i = nextLine;
        }
      }
    }
    return hosts;
  }

  private static _retrieveHost(line: string): string | null {
    const ipv4Regex = /(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}/g;
    const match = line.match(ipv4Regex);

    if (!match)
      return null;
    return match[0];
  }

  private static _retrieveOpenedPorts(host: string, lines: string[], i: number): { services: ServiceState[], nextLine: number } {
    const services: ServiceState[] = [];

    // Search 'PORT    STATE    SERVICE    REASON' line
    while (!lines[i]?.includes('PORT') && !lines[i]?.includes('STATE') && !lines[i]?.includes('SERVICE'))
      i++;
    i++; // Skip 'PORT    STATE    SERVICE    REASON' line

    for (; i < lines.length; i++) {
      const line = lines[i];
      if (!line) break;
      const portData = NmapParser._retrievePortData(line);
      if (!portData) continue;
      else services.push(portData);
    }
    return { services: services, nextLine: i };
  }

  private static _retrievePortData(line: string): ServiceState | null {
    const cleanLine = line.trim().split(/\s+/);
    if (cleanLine.length < 3) return null;

    const [portToken, stateToken, serviceNameToken] = cleanLine;
    if (!portToken || !stateToken || !serviceNameToken) return null;

    const portProtocol = NmapParser._extractPort(portToken);
    if (portProtocol === null) return null;

    const [port, protocol] = portProtocol;
    if (!port || (stateToken !== 'open' && stateToken !== 'closed' && stateToken !== 'filtered')) return null;

    return {
      port,
      protocol: protocol,
      state: stateToken,
      name: serviceNameToken,
    };
  }

  private static _extractPort(cleanLine: string): [number, string] | null {
    const rawPort = cleanLine.split('/');
    const port = Number(rawPort[0]);
    const protocol = rawPort[1];

    if (isNaN(port) || !protocol) return null;

    return [port, protocol];
  }

  private static _isHostUp(line: string): boolean {
    return !line.includes('host down');
  }

}
