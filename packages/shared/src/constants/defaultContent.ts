import type { BlockType, BlockContent, BlockStyles } from '../types'

export function getDefaultContent(type: BlockType): BlockContent {
  switch (type) {
    case 'hero_banner':
      return {
        title: 'Welcome to Our Platform',
        subtitle: 'Your subtitle goes here',
        description: 'Add a compelling description that explains your value proposition.',
        buttons: [
          { text: 'Get Started', link: '/', variant: 'primary' },
          { text: 'Learn More', link: '/about', variant: 'outline' },
        ],
        badge: 'New',
      }
    case 'image_left_content_right':
    case 'content_left_image_right':
      return {
        title: 'Section Title',
        subtitle: 'Section Subtitle',
        description: 'Add your section description here.',
        buttons: [{ text: 'Learn More', link: '/', variant: 'primary' }],
        image: { url: '', alt: 'Section image' },
      }
    case 'centered_text':
      return {
        badge: 'Badge',
        title: 'Section Title',
        description: 'Add your section description here.',
        buttons: [{ text: 'Call to Action', link: '/', variant: 'primary' }],
      }
    case 'feature_cards':
      return {
        badge: 'Features',
        title: 'Our Key Features',
        description: 'Discover what makes us different.',
        columns: 3,
        cards: [
          { id: '1', icon: 'star', title: 'Feature One', description: 'Description of this feature.' },
          { id: '2', icon: 'zap', title: 'Feature Two', description: 'Description of this feature.' },
          { id: '3', icon: 'shield', title: 'Feature Three', description: 'Description of this feature.' },
        ],
      }
    case 'services_section':
      return {
        badge: 'Services',
        title: 'What We Offer',
        description: 'Explore our range of services.',
        services: [
          { id: '1', icon: 'briefcase', title: 'Service One', description: 'Description here.', features: ['Feature A', 'Feature B'] },
          { id: '2', icon: 'layers', title: 'Service Two', description: 'Description here.', features: ['Feature A', 'Feature B'] },
        ],
      }
    case 'course_listing':
      return {
        badge: 'Courses',
        title: 'Our Courses',
        description: 'Explore all available courses.',
        columns: 3,
        courses: [
          { id: '1', title: 'Course Title', description: 'Course description.', duration: '4 weeks', level: 'Beginner', price: 'Free', image: { url: '', alt: '' } },
        ],
      }
    case 'about_section':
      return {
        badge: 'About Us',
        title: 'Who We Are',
        description: 'Tell your story here.',
        highlights: ['Highlight one', 'Highlight two', 'Highlight three'],
        image: { url: '', alt: 'About us image' },
        stats: [
          { label: 'Students', value: '1,000+' },
          { label: 'Courses', value: '50+' },
          { label: 'Years', value: '5+' },
        ],
        buttons: [{ text: 'Learn More', link: '/about', variant: 'primary' }],
      }
    case 'gallery_section':
      return {
        title: 'Gallery',
        description: '',
        columns: 3,
        items: [],
      }
    case 'video_section':
      return {
        title: 'Watch Our Video',
        description: '',
        videoUrl: '',
        autoplay: false,
        muted: true,
      }
    case 'testimonials':
      return {
        badge: 'Testimonials',
        title: 'What Our Clients Say',
        description: '',
        items: [
          { id: '1', name: 'Jane Doe', role: 'CEO', company: 'Company Inc.', content: 'This is an amazing platform!', rating: 5 },
          { id: '2', name: 'John Smith', role: 'Manager', company: 'Org Ltd.', content: 'Highly recommended!', rating: 5 },
        ],
      }
    case 'faq':
      return {
        badge: 'FAQ',
        title: 'Frequently Asked Questions',
        description: '',
        items: [
          { id: '1', question: 'What is this platform?', answer: 'A powerful website builder and CMS.' },
          { id: '2', question: 'Is it easy to use?', answer: 'Yes, no coding required.' },
        ],
      }
    case 'call_to_action':
      return {
        badge: '',
        title: 'Ready to Get Started?',
        description: 'Join thousands of users who trust our platform.',
        buttons: [
          { text: 'Sign Up Free', link: '/', variant: 'primary' },
          { text: 'Contact Us', link: '/contact', variant: 'outline' },
        ],
      }
    case 'statistics_counters':
      return {
        badge: 'By the Numbers',
        title: 'Our Impact',
        columns: 4,
        stats: [
          { id: '1', value: '1000', suffix: '+', label: 'Students' },
          { id: '2', value: '50', suffix: '+', label: 'Courses' },
          { id: '3', value: '95', suffix: '%', label: 'Satisfaction' },
          { id: '4', value: '5', suffix: ' yrs', label: 'Experience' },
        ],
      }
    case 'team_section':
      return {
        badge: 'Our Team',
        title: 'Meet the Team',
        description: '',
        columns: 3,
        members: [
          { id: '1', name: 'Alice Johnson', role: 'CEO & Founder', bio: 'Passionate about education.', image: { url: '', alt: '' } },
        ],
      }
    case 'pricing_section':
      return {
        badge: 'Pricing',
        title: 'Simple, Transparent Pricing',
        description: 'Choose the plan that works for you.',
        tiers: [
          {
            id: '1',
            name: 'Basic',
            price: 'Free',
            description: 'Get started for free.',
            features: ['5 courses', 'Community access', 'Basic support'],
            cta: { text: 'Get Started', link: '/', variant: 'outline' },
          },
          {
            id: '2',
            name: 'Pro',
            price: '$29',
            period: '/mo',
            description: 'For serious learners.',
            features: ['Unlimited courses', 'Certificate', 'Priority support', 'Mentorship'],
            cta: { text: 'Start Pro', link: '/', variant: 'primary' },
            highlighted: true,
            badge: 'Popular',
          },
        ],
      }
    case 'contact_section':
      return {
        badge: 'Contact',
        title: 'Get In Touch',
        description: 'We would love to hear from you.',
        email: 'hello@example.com',
        phone: '+1 234 567 890',
        address: '123 Main St, City, Country',
        showForm: true,
        formTitle: 'Send us a message',
      }
    case 'map_section':
      return {
        title: 'Find Us',
        embedUrl: '',
        height: '400px',
      }
    case 'newsletter_section':
      return {
        badge: 'Newsletter',
        title: 'Stay in the Loop',
        description: 'Subscribe to our newsletter for the latest updates.',
        placeholder: 'Enter your email',
        buttonText: 'Subscribe',
        privacyNote: 'We respect your privacy. Unsubscribe anytime.',
      }
    case 'rich_text':
      return { html: '<p>Add your content here...</p>' }
    case 'custom_html':
      return { html: '<!-- Add your HTML here -->', css: '' }
    default:
      return {} as BlockContent
  }
}

export function getDefaultStyles(): BlockStyles {
  return {
    backgroundColor: '',
    textColor: '',
    alignment: 'center',
    paddingTop: '80px',
    paddingBottom: '80px',
    containerWidth: 'wide',
  }
}
