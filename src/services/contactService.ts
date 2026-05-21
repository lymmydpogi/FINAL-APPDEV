import { API_BASE_URL } from './config';

export type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

/**
 * POST /client/contact — same form as the website (Twig).
 * Note: may require CSRF on WEBAPP; if it fails, use the website contact page.
 */
export async function submitContactForm(data: ContactForm): Promise<void> {
  const body = new URLSearchParams({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
  }).toString();

  const response = await fetch(`${API_BASE_URL}/client/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'text/html,application/json',
    },
    body,
  });

  if (!response.ok && response.status !== 302) {
    throw new Error(
      `Could not send message (${response.status}). Use the website contact page if this persists.`,
    );
  }
}
