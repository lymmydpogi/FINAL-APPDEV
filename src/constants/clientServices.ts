/**
 * Matches WEBAPP ServicesController static list (until all data comes from API).
 */
export type ClientService = {
  slug: string;
  name: string;
  tagline: string;
};

export const CLIENT_SERVICES: ClientService[] = [
  {
    slug: 'logo-making',
    name: 'Logo Making',
    tagline: 'Clean, modern identities that feel memorable.',
  },
  {
    slug: 'photo-editing',
    name: 'Photo Editing',
    tagline: 'Sharp imagery that elevates your brand.',
  },
  {
    slug: 'video-editing',
    name: 'Video Editing',
    tagline: 'Engaging stories with polished pacing.',
  },
  {
    slug: 'web-app-development',
    name: 'Web/App Development',
    tagline: 'Responsive, user-friendly digital products.',
  },
  {
    slug: 'graphic-design',
    name: 'Graphic Design',
    tagline: 'Consistent creative aligned to your goals.',
  },
];

export function getServiceBySlug(slug: string): ClientService | undefined {
  return CLIENT_SERVICES.find(s => s.slug === slug);
}
