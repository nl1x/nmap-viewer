import * as fs from 'fs';

interface PortState {
  port: number;
  state: 'open' | 'closed' | 'filtered';
  name: string;
}

export interface HostState {
  ip: string;
  state: 'online' | 'offline';
  ports: PortState[];
}

export class NmapParser {

  static parse(filePath: string) {
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
          hosts.push({ip: host, ports: [], state: 'offline'});
        } else {
          const { ports, nextLine } = NmapParser._retrieveOpenedPorts(host, lines, i);
          hosts.push({ ip: host, ports, state: 'online' });
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

  private static _retrieveOpenedPorts(host: string, lines: string[], i: number): { ports: PortState[], nextLine: number } {
    const ports: PortState[] = [];

    console.log(`Checking host at line n°${i} (${lines[i]})`);
    // Search 'PORT    STATE    SERVICE    REASON' line
    while (!lines[i]?.includes('PORT') && !lines[i]?.includes('STATE') && !lines[i]?.includes('SERVICE'))
      i++;
    i++; // Skip 'PORT    STATE    SERVICE    REASON' line

    for (; i < lines.length; i++) {
      const line = lines[i];
      if (!line) break;
      const portData = NmapParser._retrievePortData(line);
      if (!portData) continue;
      else ports.push(portData);
    }
    return { ports, nextLine: i };
  }

  private static _retrievePortData(line: string): PortState | null {
    const cleanLine = line.trim().split(/\s+/);
    if (cleanLine.length < 3) return null;

    const [portToken, stateToken, serviceNameToken] = cleanLine;
    if (!portToken || !stateToken || !serviceNameToken) return null;

    const port = NmapParser._extractPort(portToken);
    if (!port || (stateToken !== 'open' && stateToken !== 'closed' && stateToken !== 'filtered')) return null;

    return {
      port,
      state: stateToken,
      name: serviceNameToken,
    };
  }

  private static _extractPort(cleanLine: string): number | null {
    const rawPort = cleanLine.split('/');
    const port = Number(rawPort[0]);

    if (isNaN(port)) return null;

    return port;
  }

  private static _isHostUp(line: string): boolean {
    return !line.includes('host down');
  }

}
