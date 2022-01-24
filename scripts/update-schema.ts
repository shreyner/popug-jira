import { join } from 'node:path';
import { MikroORM } from '@mikro-orm/core';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { Logger } from '@nestjs/common';

const logger = new Logger('MikroORM-script');

const argv = process.argv.slice(2);
const appName = argv[0];

if (isNil(appName)) {
  console.log('ts-node re-create-schema [app name]');
  process.exit(1);
}

(async () => {
  const options = await import(
    join(__dirname, '..', 'apps', appName, 'src', 'mikro-orm.config.ts')
  ).then(({ default: options }) => options);

  if (isNil(options)) {
    console.log(`Invalid app name or not fount mikro-orm.config.ts in app`);
    process.exit(1);
  }

  const orm = await MikroORM.init(options);
  const generator = orm.getSchemaGenerator();

  const updateDump = await generator.getUpdateSchemaSQL();
  logger.log(updateDump);

  // or you can run those queries directly, but be sure to check them first!
  // await generator.createSchema();
  await generator.updateSchema();

  await orm.close(true);
})().catch((error) => {
  logger.error(error);
  process.exit(1);
});
