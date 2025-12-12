import {type HostState, NmapParser} from '#parser/nmap-parser';
import HostsModel from '#app/hosts/hosts.model';
import ServicesModel from '#app/services/services.model';
import { Op } from 'sequelize';

export default class AppService {

  static async getHosts() {
    const hosts = await HostsModel.findAll({
      include: [{ model: ServicesModel, as: 'services' }]
    });

    return hosts.map(host => {
      const values = host.toJSON();
      return {
        ipv4: values.ipv4,
        state: values.state,
        services: values.services === undefined
          ? []
          : values.services.sort((a, b) => a.port - b.port).map((service) => {
            return {
              port: service.port,
              protocol: service.protocol,
              state: service.state,
              name: service.name,
            }
          })
      };
    }).sort((a, b) => NmapParser.ipToAddress(a.ipv4) - NmapParser.ipToAddress(b.ipv4));
  }

  static async saveHosts(hosts: HostState[]) {
    for (const host of hosts) {
      const [hostData, created] = await HostsModel.findOrCreate({
        where: { ipv4: host.ipv4 },
        defaults: {
          ipv4: host.ipv4,
          state: host.state,
        },
      });

      if (!created) await hostData.update({ state: host.state });

      for (const service of host.services) {
        const [serviceData, created] = await ServicesModel.findOrCreate({
          where: {
            [Op.and]: {
              host_ipv4: host.ipv4,
              port: service.port,
            }
          },
          defaults: {
            host_ipv4: host.ipv4,
            port: service.port,
            protocol: service.protocol,
            state: service.state,
            name: service.name,
          }
        });

        if (!created) {
          await serviceData.update({
            name: service.name,
            state: service.state,
            protocol: service.protocol,
          })
        }
      }
    }
  }

}