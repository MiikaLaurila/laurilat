import { UserModel } from '../user/models/UserSchema';

const migrations = [
  {
    model: UserModel,
    addField: 'profileImage',
    defaultValue: '',
  },
] as const;

export const runMigrations = async () => {
  console.log('Running migrations');
  for (const migration of migrations) {
    console.log('Running migration:', migration);
    const result = await migration.model.updateMany(
      { [migration.addField]: undefined },
      { [migration.addField]: migration.defaultValue }
    );
    console.log(result);
  }
};
