import type { BlockType } from '../types'

export interface BlockTypeMeta {
  type: BlockType
  label: string
  description: string
  icon: string
  category: 'hero' | 'content' | 'media' | 'social' | 'conversion' | 'utility'
}

export const BLOCK_TYPES: BlockTypeMeta[] = [
  {
    type: 'hero_banner',
    label: 'Hero Banner',
    description: 'Full-width hero section with title, text, buttons and background',
    icon: 'layout-template',
    category: 'hero',
  },
  {
    type: 'image_left_content_right',
    label: 'Image Left + Content Right',
    description: 'Two-column section with image on the left',
    icon: 'panel-left',
    category: 'content',
  },
  {
    type: 'content_left_image_right',
    label: 'Content Left + Image Right',
    description: 'Two-column section with image on the right',
    icon: 'panel-right',
    category: 'content',
  },
  {
    type: 'centered_text',
    label: 'Centered Text',
    description: 'Centered heading, paragraph and optional buttons',
    icon: 'align-center',
    category: 'content',
  },
  {
    type: 'feature_cards',
    label: 'Feature Cards',
    description: 'Grid of feature cards with icons, titles and descriptions',
    icon: 'layout-grid',
    category: 'content',
  },
  {
    type: 'services_section',
    label: 'Services Section',
    description: 'Services list with icons and feature bullets',
    icon: 'briefcase',
    category: 'content',
  },
  {
    type: 'course_listing',
    label: 'Course Listing',
    description: 'Grid of courses with images, titles and pricing',
    icon: 'graduation-cap',
    category: 'content',
  },
  {
    type: 'about_section',
    label: 'About Section',
    description: 'About us layout with image, highlights and stats',
    icon: 'info',
    category: 'content',
  },
  {
    type: 'gallery_section',
    label: 'Gallery',
    description: 'Image gallery grid with captions',
    icon: 'images',
    category: 'media',
  },
  {
    type: 'video_section',
    label: 'Video Section',
    description: 'Embedded video with optional title and description',
    icon: 'play-circle',
    category: 'media',
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    description: 'Customer testimonials with ratings',
    icon: 'quote',
    category: 'social',
  },
  {
    type: 'faq',
    label: 'FAQ',
    description: 'Frequently asked questions accordion',
    icon: 'help-circle',
    category: 'content',
  },
  {
    type: 'call_to_action',
    label: 'Call to Action',
    description: 'Prominent CTA section with title and buttons',
    icon: 'megaphone',
    category: 'conversion',
  },
  {
    type: 'statistics_counters',
    label: 'Statistics / Counters',
    description: 'Animated stat numbers and labels',
    icon: 'bar-chart-2',
    category: 'content',
  },
  {
    type: 'team_section',
    label: 'Team Section',
    description: 'Team members grid with photos and bios',
    icon: 'users',
    category: 'social',
  },
  {
    type: 'pricing_section',
    label: 'Pricing',
    description: 'Pricing tiers / plans with feature lists',
    icon: 'credit-card',
    category: 'conversion',
  },
  {
    type: 'contact_section',
    label: 'Contact Section',
    description: 'Contact info and optional form',
    icon: 'mail',
    category: 'conversion',
  },
  {
    type: 'map_section',
    label: 'Map',
    description: 'Embedded Google Maps or similar',
    icon: 'map-pin',
    category: 'utility',
  },
  {
    type: 'newsletter_section',
    label: 'Newsletter',
    description: 'Email newsletter signup form',
    icon: 'send',
    category: 'conversion',
  },
  {
    type: 'rich_text',
    label: 'Rich Text',
    description: 'WYSIWYG rich text content block',
    icon: 'type',
    category: 'utility',
  },
  {
    type: 'custom_html',
    label: 'Custom HTML',
    description: 'Raw HTML and CSS injection',
    icon: 'code',
    category: 'utility',
  },
]

export const BLOCK_CATEGORIES = [
  { id: 'hero', label: 'Hero' },
  { id: 'content', label: 'Content' },
  { id: 'media', label: 'Media' },
  { id: 'social', label: 'Social Proof' },
  { id: 'conversion', label: 'Conversion' },
  { id: 'utility', label: 'Utility' },
]
