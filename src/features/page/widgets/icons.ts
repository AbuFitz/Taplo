import {
  AtSign, BadgeCheck, BadgePercent, CalendarCheck, Clock, Compass, CircleHelp, CreditCard, FileDown, Image, Images, Link, ListChecks, Mail, Map, MapPin, Megaphone, MessageCircle, MessageSquare, Phone, Play, ReceiptText, ShoppingBag, Share2, Sparkles, Star, ThumbsUp, Type, Users,
  type LucideIcon,
} from "lucide-react";

/** Explicit map so icon names stored in the registry resolve without importing the whole icon set. */
export const ICONS: Record<string, LucideIcon> = {
  AtSign, BadgeCheck, BadgePercent, CalendarCheck, Clock, Compass, CircleHelp, CreditCard, FileDown, Image, Images, Link, ListChecks, Mail, Map, MapPin, Megaphone, MessageCircle, MessageSquare, Phone, Play, ReceiptText, ShoppingBag, Share2, Sparkles, Star, ThumbsUp, Type, Users,
};
export const iconFor = (name: string): LucideIcon => ICONS[name] ?? Link;
