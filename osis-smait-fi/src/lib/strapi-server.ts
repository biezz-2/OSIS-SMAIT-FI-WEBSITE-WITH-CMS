import { draftMode } from 'next/headers';
import { fetchStrapiAPI, FetchStrapiOptions } from './strapi';

export async function isDraftModeEnabled(): Promise<boolean> {
  try {
    const draft = await draftMode();
    return draft.isEnabled;
  } catch {
    return false;
  }
}

export async function fetchStrapiServerAPI<T>(endpoint: string, options: FetchStrapiOptions = {}): Promise<T | null> {
  const isDraftMode = await isDraftModeEnabled();

  return fetchStrapiAPI<T>(endpoint, {
    ...options,
    isDraftMode: options.isDraftMode ?? isDraftMode,
  });
}
