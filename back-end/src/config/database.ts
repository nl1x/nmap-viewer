import { Sequelize } from 'sequelize';
import config from './config.js';
import HostsModel, { initHostsModel } from '#app/hosts/hosts.model';
import ServicesModel, { initServicesModel } from '#app/services/services.model';

const database = new Sequelize(config.database.db_name, config.database.username, config.database.password, {
  host: config.database.host,
  port: config.database.port,
  dialect: 'postgres',
  sync: {
    alter: config.isDevelopment(),
    force: config.isDevelopment(),
    logging: config.isDevelopment(),
  }
});

async function createDatabaseSchema() {
  console.log('Creating schema...');
  await initHostsModel(database);
  await initServicesModel(database);
  console.log('Schema created.');
}

async function createRelations() {
  console.log('Creating relations...');

  HostsModel.hasMany(ServicesModel, {
    as: 'services',
    foreignKey: 'host_ipv4',
    sourceKey: 'ipv4'
  });

  ServicesModel.hasOne(HostsModel, {
    as: 'host',
    foreignKey: 'ipv4',
    sourceKey: 'host_ipv4'
  });

  console.log('Relations created.');
}

export async function authenticateToDatabase() {
  try {
    await database.authenticate();
    console.log('Connection established.');

    await createDatabaseSchema();
    await createRelations();

    await database.sync();
    console.log('Synchronisation done.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

export default database;
