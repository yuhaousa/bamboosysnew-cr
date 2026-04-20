// ─── Page ───────────────────────────────────────────────────────────────────

export type PageStatus = 'draft' | 'published' | 'scheduled'

export interface PageSEO {
  metaTitle?: string
  metaDescription?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonicalUrl?: string
}

export interface Page {
  id: string
  title: string
  slug: string
  status: PageStatus
  seo: PageSEO
  authorId: string
  authorName?: string
  publishedAt?: string | null
  scheduledAt?: string | null
  createdAt: string
  updatedAt: string
  blockCount?: number
}

export interface PageWithBlocks extends Page {
  blocks: Block[]
}

// ─── Blocks ──────────────────────────────────────────────────────────────────

export type BlockType =
  | 'hero_banner'
  | 'image_left_content_right'
  | 'content_left_image_right'
  | 'centered_text'
  | 'feature_cards'
  | 'services_section'
  | 'course_listing'
  | 'about_section'
  | 'gallery_section'
  | 'video_section'
  | 'testimonials'
  | 'faq'
  | 'call_to_action'
  | 'statistics_counters'
  | 'team_section'
  | 'pricing_section'
  | 'contact_section'
  | 'map_section'
  | 'newsletter_section'
  | 'rich_text'
  | 'custom_html'

export interface BlockImage {
  url: string
  alt?: string
}

export interface BlockButton {
  text: string
  link: string
  variant: 'primary' | 'secondary' | 'outline' | 'ghost'
  target?: '_blank' | '_self'
}

export interface BlockStyles {
  variant?: 'light' | 'dark' | 'glass' | 'gradient'
  backgroundColor?: string
  textColor?: string
  backgroundImage?: string
  alignment?: 'left' | 'center' | 'right'
  paddingTop?: string
  paddingBottom?: string
  paddingLeft?: string
  paddingRight?: string
  containerWidth?: 'full' | 'wide' | 'narrow'
}

// ─── Block Content Types ──────────────────────────────────────────────────────

export interface HeroBannerContent {
  title: string
  titleColor?: string
  subtitle?: string
  subtitleColor?: string
  description?: string
  descriptionColor?: string
  buttons: BlockButton[]
  image?: BlockImage
  backgroundImage?: BlockImage
  badge?: string
}

export interface ImageTextContent {
  title: string
  subtitle?: string
  description: string
  buttons: BlockButton[]
  image: BlockImage
}

export interface CenteredTextContent {
  badge?: string
  title: string
  description?: string
  buttons: BlockButton[]
}

export interface CardItem {
  id: string
  icon?: string
  title: string
  description: string
  link?: string
}

export interface FeatureCardsContent {
  badge?: string
  title: string
  description?: string
  cards: CardItem[]
  columns: 2 | 3 | 4
}

export interface ServiceItem {
  id: string
  icon?: string
  title: string
  description: string
  features: string[]
  link?: string
  linkText?: string
}

export interface ServicesSectionContent {
  badge?: string
  title: string
  subtitle?: string
  description?: string
  services: ServiceItem[]
}

export interface CourseItem {
  id: string
  image?: BlockImage
  title: string
  description: string
  duration?: string
  level?: string
  price?: string
  link?: string
}

export interface CourseListingContent {
  badge?: string
  title: string
  description?: string
  courses: CourseItem[]
  columns: 2 | 3 | 4
}

export interface AboutHighlight {
  id: string
  icon?: string
  title: string
  description?: string
}

export interface AboutSectionContent {
  badge?: string
  title: string
  subtitle?: string
  description: string
  highlights: string[] | AboutHighlight[]
  image: BlockImage
  stats: Array<{ id?: string; label: string; value: string }>
  buttons: BlockButton[]
}
  buttons: BlockButton[]
}

export interface GalleryItem {
  id: string
  image: BlockImage
  caption?: string
}

export interface GallerySectionContent {
  title?: string
  description?: string
  items: GalleryItem[]
  columns: 2 | 3 | 4
}

export interface VideoSectionContent {
  title?: string
  description?: string
  videoUrl: string
  videoPoster?: BlockImage
  autoplay?: boolean
  muted?: boolean
}

export interface TestimonialItem {
  id: string
  name: string
  role?: string
  company?: string
  avatar?: BlockImage
  content: string
  rating?: number
}

export interface TestimonialsContent {
  badge?: string
  title?: string
  description?: string
  items: TestimonialItem[]
}

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface FAQContent {
  badge?: string
  title?: string
  description?: string
  items: FAQItem[]
}

export interface CTAContent {
  badge?: string
  title: string
  description?: string
  buttons: BlockButton[]
  backgroundImage?: BlockImage
}

export interface StatItem {
  id: string
  value: string
  label: string
  prefix?: string
  suffix?: string
  icon?: string
}

export interface StatisticsContent {
  badge?: string
  title?: string
  description?: string
  stats: StatItem[]
  columns: 2 | 3 | 4
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  image?: BlockImage
  social?: { platform: string; url: string }[]
}

export interface TeamSectionContent {
  badge?: string
  title?: string
  description?: string
  members: TeamMember[]
  columns: 2 | 3 | 4
}

export interface PricingTier {
  id: string
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  cta: BlockButton
  highlighted?: boolean
  badge?: string
}

export interface PricingSectionContent {
  badge?: string
  title?: string
  description?: string
  tiers: PricingTier[]
}

export interface ContactSectionContent {
  badge?: string
  title?: string
  description?: string
  email?: string
  phone?: string
  address?: string
  showForm?: boolean
  formTitle?: string
  formButtonText?: string
}

export interface MapSectionContent {
  title?: string
  description?: string
  embedUrl: string
  height?: string
}

export interface NewsletterContent {
  badge?: string
  title: string
  description?: string
  placeholder?: string
  buttonText?: string
  privacyNote?: string
}

export interface RichTextContent {
  html: string
}

export interface CustomHTMLContent {
  html: string
  css?: string
}

export type BlockContent =
  | HeroBannerContent
  | ImageTextContent
  | CenteredTextContent
  | FeatureCardsContent
  | ServicesSectionContent
  | CourseListingContent
  | AboutSectionContent
  | GallerySectionContent
  | VideoSectionContent
  | TestimonialsContent
  | FAQContent
  | CTAContent
  | StatisticsContent
  | TeamSectionContent
  | PricingSectionContent
  | ContactSectionContent
  | MapSectionContent
  | NewsletterContent
  | RichTextContent
  | CustomHTMLContent

export interface Block {
  id: string
  pageId: string
  type: BlockType
  content: BlockContent
  styles: BlockStyles
  isVisible: boolean
  sortOrder: number
}

// ─── Media ───────────────────────────────────────────────────────────────────

export interface MediaItem {
  id: string
  filename: string
  r2Key: string
  url: string
  size: number
  mimeType: string
  alt?: string
  uploadedBy: string
  createdAt: string
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export interface SocialLinks {
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  tiktok?: string
}

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontHeading: string
  fontBody: string
  headerStyle?: 'light' | 'dark'
  headerBgColor?: string
  navCtaText?: string
  navCtaLink?: string
  navShowLanguage?: boolean
  navLanguageText?: string
  logoShape?: 'circle' | 'none'
  logoUrl?: string
  faviconUrl?: string
  footerText?: string
}

export interface SiteSettings {
  siteName: string
  tagline?: string
  logo?: string
  favicon?: string
  defaultMetaTitle?: string
  defaultMetaDescription?: string
  contactEmail?: string
  contactPhone?: string
  address?: string
  socialLinks: SocialLinks
  theme: ThemeConfig
  maintenanceMode: boolean
  maintenanceMessage?: string
}

// ─── Menus ────────────────────────────────────────────────────────────────────

export interface MenuItem {
  id: string
  label: string
  link: string
  target?: '_blank' | '_self'
  children?: MenuItem[]
}

export interface Menu {
  id: string
  name: string
  slug: string
  items: MenuItem[]
  createdAt: string
}

// ─── Revisions ───────────────────────────────────────────────────────────────

export interface PageRevision {
  id: string
  pageId: string
  blocksSnapshot: Block[]
  createdBy: string
  createdAt: string
}

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export type AuditAction =
  | 'page.create' | 'page.update' | 'page.delete' | 'page.publish' | 'page.unpublish'
  | 'block.create' | 'block.update' | 'block.delete' | 'block.reorder'
  | 'media.upload' | 'media.delete'
  | 'settings.update' | 'menu.update'
  | 'user.login' | 'user.role_change'

export interface AuditLog {
  id: string
  userId: string
  userName?: string
  action: AuditAction
  resourceType: string
  resourceId: string
  metadata?: Record<string, unknown>
  createdAt: string
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  details?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole = 'super_admin' | 'admin' | 'editor'

export interface UserProfile {
  id: string
  role: UserRole
  displayName: string
  email: string
  avatarUrl?: string
  createdAt: string
}
