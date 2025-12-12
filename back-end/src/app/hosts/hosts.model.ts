import { Sequelize, DataTypes, Model, type Optional } from 'sequelize';
import ServicesModel from '#app/services/services.model';

export interface HostAttributes {
  ipv4: string;
  state: 'online' | 'offline';
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;

  services?: ServicesModel[] | undefined;
}

export type HostCreationAttributes = Optional<HostAttributes, 'createdAt' | 'updatedAt'>;

export default class Hosts extends Model<HostAttributes, HostCreationAttributes> {
  public ipv4!: string;
  public state!: 'online' | 'offline';
  public readonly createdAt!: Date | undefined;
  public readonly updatedAt!: Date | undefined;

  public toJSON(): HostAttributes {
    const values = this.get({ plain: true });
    return {
      ipv4: values.ipv4,
      state: values.state,
      services: values.services,
      createdAt: values.createdAt,
      updatedAt: values.updatedAt
    };
  }
}

export async function initHostsModel(database: Sequelize) {
  Hosts.init(
    {
      ipv4: {
        type: DataTypes.STRING(15),
        allowNull: false,
        primaryKey: true,
      },
      state: {
        type: DataTypes.ENUM('online', 'offline'),
        allowNull: false,
      },
    },
    {
      sequelize: database,
      modelName: 'Hosts',
      timestamps: true
    }
  );
}
