import { EditablePostModel } from '../endpoints/post/post.schema.js';
import { UserModel } from '../endpoints/user/user.schema.js';

const migrations = [
  {
    model: UserModel,
    addField: 'profileImage',
    defaultValue: '',
  },
  {
    model: EditablePostModel,
    addField: 'alias',
    defaultValue: '',
  },
  {
    model: EditablePostModel,
    addField: 'meta',
    defaultValue: {},
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
