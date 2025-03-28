import { generateId } from 'lucia';
import { actionResult, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

import type { RequestHandler } from './$types';

import { db } from '$lib/db';
import { lucia } from '$lib/server/auth';
import {
  createSession,
  createUser,
  usernameExists,
} from '$lib/server/utils/auth';
import { hashArgon2 } from '$lib/server/utils/hash';
import { signUpSchema } from '$lib/zod/auth';

export const POST: RequestHandler = async ({ cookies, request }) => {
  const form = await superValidate(request, zod(signUpSchema));
  if (!form.valid) {
    return actionResult('failure', { form });
  }

  const owners = await db
    .selectFrom('user')
    .where('role', '=', 'owner')
    .selectAll()
    .execute();
  if (owners.length > 0) {
    form.message = { type: 'error', text: 'Owner already exists' };
    return actionResult('failure', { form });
  }

  const { username, password, displayName, unit } = form.data;
  const exists = await usernameExists(username);
  if (exists) {
    setError(form, 'username', 'Username already exists');
    return actionResult('failure', { form });
  }

  const userId = generateId(15);
  const hashedPassword = await hashArgon2(password);

  // Always create the first user as the owner
  const success = await createUser(
    userId,
    username,
    hashedPassword,
    displayName,
    unit,
    'owner',
  );

  if (!success) {
    form.message = { type: 'error', text: 'Failed to create user' };
    return actionResult('failure', { form });
  }

  await createSession(lucia, userId, cookies);

  return actionResult('redirect', '/', 303);
};
