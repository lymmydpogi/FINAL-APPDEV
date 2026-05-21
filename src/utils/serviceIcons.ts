import { Briefcase, Code2, Image, Palette, PenLine, Video } from 'lucide-react-native';

import type { SvgIcon } from '../types/svgIcon';

/** Lucide icon for a service row from slug / name heuristics. */
export function serviceIconFor(slug: string, name: string): SvgIcon {
  const s = `${slug} ${name}`.toLowerCase();
  if (s.includes('logo')) {
    return PenLine;
  }
  if (s.includes('photo') || s.includes('image')) {
    return Image;
  }
  if (s.includes('video')) {
    return Video;
  }
  if (s.includes('web') || s.includes('app') || s.includes('development')) {
    return Code2;
  }
  if (s.includes('graphic') || s.includes('design')) {
    return Palette;
  }
  return Briefcase;
}
