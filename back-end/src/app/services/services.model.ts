import { Sequelize, DataTypes, Model, type Optional } from 'sequelize';

export interface ServiceAttributes {
  id: number;
  host_ipv4: string;
  name: string;
  port: number;
  state: 'open' | 'closed' | 'filtered';
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

export type ServiceCreationAttributes = Optional<ServiceAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export default class ServicesModel extends Model<ServiceAttributes, ServiceCreationAttributes> {
  public id!: number;
  public host_ipv4!: string;
  public name!: string;
  public port!: number;
  public state!: 'open' | 'closed' | 'filtered';
  public readonly createdAt!: Date | undefined;
  public readonly updatedAt!: Date | undefined;

  public toJSON(): ServiceAttributes {
    const values = this.get();
    return {
      id: values.id,
      host_ipv4: values.host_ipv4,
      name: values.name,
      port: values.port,
      state: values.state,
      createdAt: values.createdAt,
      updatedAt: values.updatedAt
    };
  }
}

export async function initServicesModel(database: Sequelize) {
  ServicesModel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      host_ipv4: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(24),
        allowNull: false,
      },
      port: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      state: {
        type: DataTypes.ENUM('open', 'closed', 'filtered'),
        allowNull: false,
      },
    },
    {
      sequelize: database,
      modelName: 'Services',
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ['host_ipv4', 'port'],
          name: 'services_host_ipv4_port_unique'
        }
      ]
    }
  );
}
