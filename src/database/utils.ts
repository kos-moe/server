import { UpdateDeleteAction, char } from 'drizzle-orm/pg-core';

type FKType = {
  onUpdate: UpdateDeleteAction;
  onDelete: UpdateDeleteAction;
};

export const CASCADE: FKType = {
  onUpdate: 'cascade',
  onDelete: 'cascade',
};

export const id = (name = 'id') => char(name, { length: 26 });
