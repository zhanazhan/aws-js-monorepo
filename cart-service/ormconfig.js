// ormconfig.js
module.exports = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'your_username',
    password: 'your_password',
    database: 'your_database_name',
    synchronize: true,
    logging: true,
    entities: ['dist/**/index{.ts,.js}'],
    migrations: ['dist/migration/*{.ts,.js}'],
    subscribers: ['dist/subscriber/*{.ts,.js}'],
    cli: {
        entitiesDir: 'src/**/models',
        migrationsDir: 'src/migration',
        subscribersDir: 'src/subscriber',
    },
};
