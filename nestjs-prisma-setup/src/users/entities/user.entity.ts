


export enum Roles {
  USER = 'User',
  ADMIN = 'Admin',
  EDITOR = 'Editor'
}

export class User {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  roles : string[];
}
