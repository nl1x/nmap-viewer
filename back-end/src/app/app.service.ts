import type {HostState} from '../utils/nmap-parser.js';
import HostsModel from '#app/hosts/hosts.model';
import ServicesModel from '#app/services/services.model';
import {Op} from "sequelize";

export default class AppService {

  static async saveHosts(hosts: HostState[]) {
    for (const host of hosts) {
      const [hostData, created] = await HostsModel.findOrCreate({
        where: { ipv4: host.ip },
        defaults: {
          ipv4: host.ip,
          state: host.state,
        },
      }).then();

      if (!created) await hostData.update({ state: host.state });

      for (const port of host.ports) {
        const [serviceData, created] = await ServicesModel.findOrCreate({
          where: {
            [Op.and]: {
              host_ipv4: host.ip,
              port: port.port,
            }
          },
          defaults: {
            host_ipv4: host.ip,
            port: port.port,
            state: port.state,
            name: port.name,
          }
        });

        if (!created) {
          await serviceData.update({
            name: port.name,
            state: port.state,
          })
        }
      }
    }
  }

}