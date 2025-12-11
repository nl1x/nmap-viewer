import app from '#app/app.module';
import { authenticateToDatabase } from '#config/database';
import config from '#config/config';

async function main() {
  console.log('Authenticating to database...');
  await authenticateToDatabase();
  console.log('Successfully connected to database.');

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}
main().then(r => {});
