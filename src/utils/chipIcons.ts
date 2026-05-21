import {
  BadgeCheck,
  Clock,
  HeartHandshake,
  Medal,
  Package,
  Sparkles,
  UserRound,
  Users,
} from 'lucide-react-native';

import type { SvgIcon } from '../types/svgIcon';

export function landingBadgeIcon(label: string): SvgIcon {
  const l = label.toLowerCase();
  if (l.includes('turnaround') || l.includes('fast')) {
    return Clock;
  }
  if (l.includes('package') || l.includes('flexible')) {
    return Package;
  }
  if (l.includes('friendly') || l.includes('support')) {
    return HeartHandshake;
  }
  return Sparkles;
}

export function aboutValueIcon(label: string): SvgIcon {
  const l = label.toLowerCase();
  if (l.includes('professional')) {
    return Medal;
  }
  if (l.includes('collaborative')) {
    return Users;
  }
  if (l.includes('user')) {
    return UserRound;
  }
  return BadgeCheck;
}
