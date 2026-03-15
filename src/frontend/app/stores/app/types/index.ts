import type { User } from '~/types';

export type AppState = {
  user: User;
  toastError?: string;
  toastSuccess?: string;
};
