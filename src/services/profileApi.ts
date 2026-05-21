import type { WebappUser } from '../types/api';
import { throwIfApiError } from '../utils/apiEnvelope';
import { extractProfileErrorMessage } from '../utils/authErrorMessage';
import apiClient from './apiClient';
import { API_ROUTES } from './apiRoutes';

/** Load profile with a token before Redux stores it (post-login mobile access check). */
export async function fetchMeWithToken(token: string): Promise<WebappUser> {
  try {
    const response = await apiClient.get(API_ROUTES.me, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = throwIfApiError<{ user: WebappUser }>(response.data);
    if (!data.user) {
      throw new Error('Could not load user profile.');
    }
    return data.user;
  } catch (error) {
    throw new Error(extractProfileErrorMessage(error, "We couldn't load your profile. Please try again."));
  }
}

export async function getMe(): Promise<WebappUser> {
  try {
    const response = await apiClient.get(API_ROUTES.me);
    const data = throwIfApiError<{ user: WebappUser }>(response.data);
    return data.user;
  } catch (error) {
    throw new Error(extractProfileErrorMessage(error, "We couldn't load your profile. Please try again."));
  }
}

export async function updateProfile(patch: Partial<WebappUser>): Promise<WebappUser> {
  try {
    const response = await apiClient.patch(API_ROUTES.clientProfile, patch);
    const data = throwIfApiError<{ user: WebappUser }>(response.data);
    return data.user;
  } catch (error) {
    throw new Error(extractProfileErrorMessage(error, "We couldn't save your changes. Please try again."));
  }
}

export type AvatarUpload = {
  uri: string;
  type?: string;
  fileName?: string;
};

export async function updateProfileWithAvatar(
  fields: Partial<WebappUser>,
  avatar?: AvatarUpload,
): Promise<WebappUser> {
  try {
    const form = new FormData();
    if (fields.firstName !== undefined) {
      form.append('firstName', fields.firstName ?? '');
    }
    if (fields.lastName !== undefined) {
      form.append('lastName', fields.lastName ?? '');
    }
    if (fields.phone !== undefined) {
      form.append('phone', fields.phone ?? '');
    }
    if (fields.address !== undefined) {
      form.append('address', fields.address ?? '');
    }
    if (avatar?.uri) {
      form.append('avatar', {
        uri: avatar.uri,
        type: avatar.type ?? 'image/jpeg',
        name: avatar.fileName ?? 'avatar.jpg',
      } as unknown as Blob);
    }

    const response = await apiClient.post(API_ROUTES.clientProfile, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const data = throwIfApiError<{ user: WebappUser }>(response.data);
    return data.user;
  } catch (error) {
    throw new Error(extractProfileErrorMessage(error, "We couldn't save your changes. Please try again."));
  }
}

/** @deprecated Use updateProfile */
export const updateMe = updateProfile;
