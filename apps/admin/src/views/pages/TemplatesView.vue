<template>
  <div class="p-6 space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Page Templates</h1>
      <p class="text-sm text-gray-500 mt-1">Start with a pre-built page — includes sample content and images. You can edit everything after.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div
        v-for="tpl in templates" :key="tpl.id"
        class="card group hover:shadow-xl transition-all overflow-hidden p-0"
      >
        <!-- Preview image -->
        <div class="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img :src="tpl.previewImage" :alt="tpl.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span class="absolute top-3 left-3 px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full font-medium">
            {{ tpl.category }}
          </span>
          <span class="absolute bottom-3 left-3 text-white font-bold text-lg">{{ tpl.name }}</span>
        </div>

        <div class="p-4 space-y-3">
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ tpl.description }}</p>

          <!-- Block badges -->
          <div class="flex flex-wrap gap-1.5">
            <span v-for="block in tpl.blockLabels" :key="block"
              class="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-md">
              {{ block }}
            </span>
          </div>

          <!-- Auto-theme badge -->
          <div v-if="tpl.themeSettings" class="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg px-2.5 py-1.5">
            <svg class="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
            Auto-applies theme settings
          </div>

          <button
            @click="createFromTemplate(tpl)"
            :disabled="creating === tpl.id"
            class="btn btn-primary w-full"
          >
            <span v-if="creating === tpl.id">Creating...</span>
            <span v-else>Use This Template</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '@/lib/api'
import { useToast } from '@/composables/useToast'
import { v4 as uuid } from 'uuid'

const router = useRouter()
const toast = useToast()
const creating = ref<string | null>(null)

interface Template {
  id: string
  name: string
  category: string
  description: string
  previewImage: string
  blockLabels: string[]
  slug: string
  blocks: { type: string; content: Record<string, unknown>; styles: Record<string, unknown> }[]
  themeSettings?: Record<string, unknown>
}

const templates: Template[] = [
  {
    id: 'business-landing',
    name: 'Business Landing',
    category: 'Business',
    description: 'Professional homepage with hero, features, services, testimonials, and CTA.',
    previewImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    slug: 'home',
    blockLabels: ['Hero', 'Feature Cards', 'Services', 'Testimonials', 'Call to Action'],
    blocks: [
      {
        type: 'hero_banner',
        content: {
          badge: 'Welcome',
          title: 'Grow Your Business With Confidence',
          subtitle: 'The all-in-one platform to manage, scale, and succeed.',
          description: 'We help businesses of all sizes build stronger customer relationships and drive measurable results.',
          buttons: [
            { id: uuid(), text: 'Get Started Free', link: '/contact', variant: 'primary', openInNewTab: false },
            { id: uuid(), text: 'Learn More', link: '#features', variant: 'secondary', openInNewTab: false },
          ],
          backgroundImage: { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80', alt: 'Office' },
        },
        styles: { backgroundColor: '#0f172a', paddingTop: '96px', paddingBottom: '96px', alignment: 'center' },
      },
      {
        type: 'feature_cards',
        content: {
          badge: 'Features',
          title: 'Everything You Need',
          subtitle: 'Discover what makes us different.',
          cards: [
            { id: uuid(), icon: '⚡', title: 'Lightning Fast', description: 'Optimized for speed so your customers never wait.', link: '' },
            { id: uuid(), icon: '🔒', title: 'Secure by Default', description: 'Enterprise-grade security built into every layer.', link: '' },
            { id: uuid(), icon: '📈', title: 'Scale Easily', description: 'Grows with you from startup to enterprise.', link: '' },
            { id: uuid(), icon: '🤝', title: '24/7 Support', description: 'Real humans available whenever you need help.', link: '' },
            { id: uuid(), icon: '🎨', title: 'Fully Customizable', description: 'Make it yours with flexible design tools.', link: '' },
            { id: uuid(), icon: '📊', title: 'Deep Analytics', description: 'Understand your data with powerful insights.', link: '' },
          ],
        },
        styles: { backgroundColor: '#ffffff', paddingTop: '80px', paddingBottom: '80px', alignment: 'center' },
      },
      {
        type: 'image_left_content_right',
        content: {
          title: 'Built for Modern Teams',
          subtitle: 'Collaborate Without Limits',
          description: 'Whether your team is in one office or spread across the globe, our tools keep everyone aligned and productive. Real-time updates, smart workflows, and seamless integrations.',
          buttons: [{ id: uuid(), text: 'See How It Works', link: '/about', variant: 'primary', openInNewTab: false }],
          image: { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80', alt: 'Team collaboration' },
        },
        styles: { backgroundColor: '#f8fafc', paddingTop: '80px', paddingBottom: '80px' },
      },
      {
        type: 'testimonials',
        content: {
          badge: 'Testimonials',
          title: 'Trusted by Thousands',
          subtitle: 'Here\'s what our customers are saying.',
          testimonials: [
            { id: uuid(), name: 'Sarah Johnson', role: 'CEO, TechCorp', avatar: 'https://i.pravatar.cc/80?img=5', quote: 'This platform transformed how we operate. Revenue up 40% in 6 months.', rating: 5 },
            { id: uuid(), name: 'Mark Chen', role: 'Founder, GrowthLab', avatar: 'https://i.pravatar.cc/80?img=12', quote: 'Incredibly easy to use yet powerful enough for complex workflows.', rating: 5 },
            { id: uuid(), name: 'Amira Hassan', role: 'Head of Product, Nexus', avatar: 'https://i.pravatar.cc/80?img=9', quote: 'The support team is fantastic. Problems solved in minutes, not days.', rating: 5 },
          ],
        },
        styles: { backgroundColor: '#ffffff', paddingTop: '80px', paddingBottom: '80px', alignment: 'center' },
      },
      {
        type: 'call_to_action',
        content: {
          title: 'Ready to Get Started?',
          subtitle: 'Join 10,000+ companies already growing with us.',
          buttonText: 'Start Your Free Trial',
          buttonLink: '/contact',
          backgroundImage: { url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&q=80', alt: 'CTA background' },
        },
        styles: { paddingTop: '80px', paddingBottom: '80px', alignment: 'center' },
      },
    ],
  },
  {
    id: 'education-platform',
    name: 'Education Platform',
    category: 'Education',
    description: 'Course showcase with hero, course listings, about section, and FAQ.',
    previewImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    slug: 'courses',
    blockLabels: ['Hero', 'Course Listing', 'About', 'FAQ', 'Newsletter'],
    blocks: [
      {
        type: 'hero_banner',
        content: {
          badge: 'Learn Online',
          title: 'Unlock Your Potential With Expert-Led Courses',
          subtitle: 'Learn at your own pace, from anywhere in the world.',
          description: 'Over 500 courses in design, development, business, and more. Start learning today.',
          buttons: [
            { id: uuid(), text: 'Browse Courses', link: '#courses', variant: 'primary', openInNewTab: false },
            { id: uuid(), text: 'Free Trial', link: '/contact', variant: 'secondary', openInNewTab: false },
          ],
          backgroundImage: { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80', alt: 'Students learning' },
        },
        styles: { backgroundColor: '#1e1b4b', paddingTop: '96px', paddingBottom: '96px', alignment: 'center' },
      },
      {
        type: 'course_listing',
        content: {
          badge: 'Popular Courses',
          title: 'Start Learning Today',
          subtitle: 'Explore our most popular courses.',
          courses: [
            { id: uuid(), title: 'Complete Web Development Bootcamp', description: 'HTML, CSS, JS, React, Node.js and more in one complete course.', price: '$89', originalPrice: '$199', image: { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80', alt: 'Web Dev' }, badge: 'Bestseller', buttonText: 'Enroll Now', buttonLink: '#' },
            { id: uuid(), title: 'UI/UX Design Masterclass', description: 'Learn Figma, user research, prototyping and design systems.', price: '$69', originalPrice: '$149', image: { url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80', alt: 'Design' }, badge: 'New', buttonText: 'Enroll Now', buttonLink: '#' },
            { id: uuid(), title: 'Data Science with Python', description: 'Master data analysis, visualization, and machine learning.', price: '$99', originalPrice: '$249', image: { url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80', alt: 'Data Science' }, badge: 'Hot', buttonText: 'Enroll Now', buttonLink: '#' },
          ],
        },
        styles: { backgroundColor: '#f8fafc', paddingTop: '80px', paddingBottom: '80px', alignment: 'center' },
      },
      {
        type: 'about_section',
        content: {
          badge: 'About Us',
          title: 'We Believe in Learning That Transforms Lives',
          description: 'Founded in 2018, our platform has helped over 200,000 students worldwide develop skills that matter in today\'s job market.',
          image: { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80', alt: 'Teaching' },
          highlights: [
            { id: uuid(), icon: '🎓', title: '200K+ Students', description: 'Graduates working at top companies worldwide' },
            { id: uuid(), icon: '📚', title: '500+ Courses', description: 'New content added every week by expert instructors' },
            { id: uuid(), icon: '🌍', title: '50+ Countries', description: 'A truly global learning community' },
          ],
          stats: [
            { id: uuid(), value: '200K+', label: 'Students' },
            { id: uuid(), value: '4.9★', label: 'Average Rating' },
            { id: uuid(), value: '500+', label: 'Courses' },
          ],
        },
        styles: { backgroundColor: '#ffffff', paddingTop: '80px', paddingBottom: '80px' },
      },
      {
        type: 'faq',
        content: {
          badge: 'FAQ',
          title: 'Common Questions',
          subtitle: 'Everything you need to know about our platform.',
          faqs: [
            { id: uuid(), question: 'Do I get lifetime access to courses?', answer: 'Yes! Once enrolled, you have lifetime access to all course materials including any future updates.' },
            { id: uuid(), question: 'Is there a money-back guarantee?', answer: 'Absolutely. We offer a 30-day full refund, no questions asked.' },
            { id: uuid(), question: 'Can I learn on mobile?', answer: 'Yes, our platform is fully responsive. Learn on any device, anytime.' },
            { id: uuid(), question: 'Do you issue certificates?', answer: 'Yes, you receive a certificate of completion for every course you finish.' },
          ],
        },
        styles: { backgroundColor: '#f8fafc', paddingTop: '80px', paddingBottom: '80px', alignment: 'center' },
      },
      {
        type: 'newsletter_section',
        content: {
          title: 'Get Free Learning Resources',
          subtitle: 'Join 50,000+ learners and get weekly tips, tutorials, and course updates.',
          placeholder: 'Enter your email address',
          buttonText: 'Subscribe Free',
        },
        styles: { backgroundColor: '#4f46e5', paddingTop: '64px', paddingBottom: '64px', alignment: 'center' },
      },
    ],
  },
  {
    id: 'portfolio',
    name: 'Creative Portfolio',
    category: 'Portfolio',
    description: 'Showcase your work with a hero, gallery, services, team, and contact section.',
    previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    slug: 'portfolio',
    blockLabels: ['Hero', 'Services', 'Gallery', 'Team', 'Contact'],
    blocks: [
      {
        type: 'hero_banner',
        content: {
          badge: 'Creative Studio',
          title: 'We Design Experiences That Inspire',
          subtitle: 'Award-winning design studio based in New York.',
          description: 'From brand identity to digital experiences — we craft work that connects.',
          buttons: [
            { id: uuid(), text: 'View Our Work', link: '#gallery', variant: 'primary', openInNewTab: false },
            { id: uuid(), text: 'Get In Touch', link: '#contact', variant: 'secondary', openInNewTab: false },
          ],
          backgroundImage: { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80', alt: 'Design work' },
        },
        styles: { backgroundColor: '#0a0a0a', paddingTop: '120px', paddingBottom: '120px', alignment: 'center' },
      },
      {
        type: 'services_section',
        content: {
          badge: 'Services',
          title: 'What We Do',
          subtitle: 'End-to-end creative services tailored to your brand.',
          services: [
            { id: uuid(), icon: '🎨', title: 'Brand Identity', description: 'Logos, color systems, typography and brand guidelines.', features: ['Logo Design', 'Brand Strategy', 'Style Guide', 'Marketing Assets'] },
            { id: uuid(), icon: '💻', title: 'Web Design', description: 'Pixel-perfect websites with seamless user experiences.', features: ['UI/UX Design', 'Responsive Layout', 'Prototyping', 'Design Systems'] },
            { id: uuid(), icon: '📱', title: 'App Design', description: 'Beautiful, intuitive mobile and desktop applications.', features: ['iOS & Android', 'User Research', 'Wireframing', 'Usability Testing'] },
          ],
        },
        styles: { backgroundColor: '#ffffff', paddingTop: '80px', paddingBottom: '80px', alignment: 'center' },
      },
      {
        type: 'gallery_section',
        content: {
          badge: 'Portfolio',
          title: 'Our Latest Work',
          subtitle: 'A selection of our favorite recent projects.',
          images: [
            { id: uuid(), url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80', alt: 'Project 1', caption: 'Brand Identity — Lumina Co.' },
            { id: uuid(), url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80', alt: 'Project 2', caption: 'Web Design — Apex Digital' },
            { id: uuid(), url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80', alt: 'Project 3', caption: 'App UI — Neon Finance' },
            { id: uuid(), url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&q=80', alt: 'Project 4', caption: 'Packaging — Bloom Cosmetics' },
            { id: uuid(), url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80', alt: 'Project 5', caption: 'Website — Harbor Hotels' },
            { id: uuid(), url: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=600&q=80', alt: 'Project 6', caption: 'UI System — CloudBase' },
          ],
        },
        styles: { backgroundColor: '#f8fafc', paddingTop: '80px', paddingBottom: '80px', alignment: 'center' },
      },
      {
        type: 'team_section',
        content: {
          badge: 'Our Team',
          title: 'Meet the Creatives',
          subtitle: 'Passionate designers and strategists ready to bring your vision to life.',
          members: [
            { id: uuid(), name: 'Alex Rivera', role: 'Creative Director', bio: '15 years crafting brand stories for Fortune 500s.', image: { url: 'https://i.pravatar.cc/200?img=33', alt: 'Alex Rivera' }, social: {} },
            { id: uuid(), name: 'Sofia Kim', role: 'Lead UX Designer', bio: 'Former Google designer obsessed with user delight.', image: { url: 'https://i.pravatar.cc/200?img=47', alt: 'Sofia Kim' }, social: {} },
            { id: uuid(), name: 'Jordan Lee', role: 'Motion & 3D Artist', bio: 'Brings brands to life through animation and 3D.', image: { url: 'https://i.pravatar.cc/200?img=60', alt: 'Jordan Lee' }, social: {} },
          ],
        },
        styles: { backgroundColor: '#ffffff', paddingTop: '80px', paddingBottom: '80px', alignment: 'center' },
      },
      {
        type: 'contact_section',
        content: {
          badge: 'Contact',
          title: 'Let\'s Work Together',
          subtitle: 'Tell us about your project and we\'ll get back to you within 24 hours.',
          email: 'hello@studio.com',
          phone: '+1 (555) 123-4567',
          address: '123 Creative Ave, New York, NY 10001',
        },
        styles: { backgroundColor: '#0a0a0a', paddingTop: '80px', paddingBottom: '80px', alignment: 'center' },
      },
    ],
  },
  {
    id: 'edulink',
    name: 'EduLink — Dark Pro',
    category: 'Education',
    description: 'Dark-themed education platform with gold accents, services grid, global network section, and contact form.',
    previewImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    slug: 'edulink',
    blockLabels: ['Hero', 'About + Stats', 'Services Grid', 'Global Network', 'Contact Form'],
    themeSettings: {
      primaryColor: '#2563eb',
      secondaryColor: '#1d4ed8',
      headerStyle: 'dark',
      headerBgColor: '#0d1117',
      navCtaText: 'Get Started',
      navCtaLink: '#contact',
      navShowLanguage: true,
      navLanguageText: 'EN',
      logoShape: 'circle',
    },
    blocks: [
      {
        type: 'hero_banner',
        content: {
          badge: 'Global EdTech Platform',
          title: 'Connecting Education with the World',
          titleColor: '#ffffff',
          subtitle: '',
          description: 'From local learning to global reach — we provide comprehensive educational technology solutions including online courses, personalized learning paths, and international certification programs.',
          descriptionColor: '#9ca3af',
          buttons: [
            { id: uuid(), text: 'Start Learning →', link: '#courses', variant: 'primary', openInNewTab: false },
            { id: uuid(), text: 'Explore Courses', link: '#about', variant: 'secondary', openInNewTab: false },
          ],
          backgroundImage: { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80', alt: 'Education global' },
        },
        styles: { backgroundColor: '#0d1117', paddingTop: '120px', paddingBottom: '120px', alignment: 'center' },
      },
      {
        type: 'about_section',
        content: {
          badge: 'About EduLink',
          title: 'Infrastructure for Global Educational Growth',
          subtitle: 'Educational Growth',
          description: 'More than just a learning platform — we help students access world-class education, providing comprehensive support from enrollment to certification.',
          image: { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', alt: 'Global network' },
          highlights: [
            { id: uuid(), icon: '💻', title: 'Online Platform', description: 'Dedicated online learning management system to solve cross-border education challenges.' },
            { id: uuid(), icon: '🏫', title: 'Learning Centers', description: 'EduLink operates local learning centers to support in-person educational needs, currently established in China, Singapore, Indonesia, Malaysia, and expanding globally.' },
          ],
          stats: [
            { id: uuid(), value: '50+', label: 'Countries Reached' },
            { id: uuid(), value: '200K', label: 'Active Learners' },
            { id: uuid(), value: '100%', label: 'Course Completion' },
          ],
        },
        styles: { backgroundColor: '#111827', paddingTop: '96px', paddingBottom: '96px' },
      },
      {
        type: 'services_section',
        content: {
          badge: 'Our Services',
          title: 'Six Core Service Areas',
          subtitle: 'From course promotion and international partnerships to student support and career development — a comprehensive ecosystem for global education.',
          services: [
            { id: uuid(), icon: '📣', title: 'Course Marketing', description: 'Help educational institutions expand their reach through digital marketing, brand building, and student acquisition strategies.', features: ['Digital marketing campaigns', 'Social media promotion', 'Lead generation & conversion'] },
            { id: uuid(), icon: '🌐', title: 'International Partnerships', description: 'Connect with institutions worldwide through our extensive network of universities, colleges, and training organizations.', features: ['Partnership facilitation', 'Program design support', 'International accreditation'] },
            { id: uuid(), icon: '🎓', title: 'Student Services', description: 'Comprehensive support for international students including enrollment, visa assistance, and cultural orientation.', features: ['Enrollment management', 'Visa & documentation', 'Cultural integration support'] },
            { id: uuid(), icon: '🏢', title: 'Local Support', description: 'Ground-level assistance through our regional offices to help students and institutions navigate local requirements.', features: ['Regional office support', 'Local compliance guidance', 'Community building'] },
            { id: uuid(), icon: '🤝', title: 'Industry Collaboration', description: 'Bridge the gap between education and industry through internship programs, career services, and employer partnerships.', features: ['Corporate partnerships', 'Internship programs', 'Career placement services'] },
            { id: uuid(), icon: '📈', title: 'Continuous Growth', description: 'Support lifelong learning with upskilling programs, professional development courses, and certification pathways.', features: ['Professional development', 'Skill certification', 'Learning analytics'] },
          ],
        },
        styles: { backgroundColor: '#0d1117', paddingTop: '96px', paddingBottom: '96px', alignment: 'center' },
      },
      {
        type: 'image_left_content_right',
        content: {
          badge: 'Global Network',
          title: 'Worldwide Service Network',
          subtitle: 'Covering China, Singapore, Indonesia, Malaysia, and beyond — building a seamless domestic and international service network for education.',
          description: '**Singapore HQ**\n40 Scotts Road, #02-00, Singapore 228456\n+65 6789 0123\n\n**Shanghai Office**\nJing\'an District, Nanjing West Road 1076, Building B\n+86 21 5688 3000\n\n**Jakarta Office**\nMayjen Sutoyo Ave 50, Jakarta Barat 11580\n+62 21 636 5000',
          buttons: [{ id: uuid(), text: 'Contact Our Team →', link: '#contact', variant: 'primary', openInNewTab: false }],
          image: { url: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&q=80', alt: 'Office network' },
        },
        styles: { backgroundColor: '#111827', paddingTop: '96px', paddingBottom: '96px' },
      },
      {
        type: 'contact_section',
        content: {
          badge: 'Contact Us',
          title: 'Start Your\nGlobal Learning Journey',
          subtitle: "Whether you're looking to expand your educational offerings or seeking learning opportunities abroad, our team is ready to provide customized solutions.",
          email: 'hello@edulink.com',
          phone: '+65 6789 0123',
          address: 'Singapore HQ\n40 Scotts Road, #02-00\nSingapore 228456\n\nShanghai Office\nJing\'an District, Nanjing West Road 1076',
          showForm: true,
          formTitle: 'Start Your Global Learning Journey',
          formButtonText: 'Submit Inquiry →',
        },
        styles: { backgroundColor: '#0d1117', paddingTop: '96px', paddingBottom: '96px' },
      },
    ],
  },
]

async function createFromTemplate(tpl: Template) {
  creating.value = tpl.id
  try {
    // Create the page
    const pageRes = await api.post<{ data: { id: string } }>('/pages', {
      title: tpl.name,
      slug: tpl.slug + '-' + Date.now().toString(36),
      status: 'draft',
    })
    const pageId = pageRes.data.id

    // Create blocks sequentially
    for (let i = 0; i < tpl.blocks.length; i++) {
      const b = tpl.blocks[i]
      await api.post(`/blocks/${pageId}`, {
        type: b.type,
        content: b.content,
        styles: b.styles,
        sortOrder: i,
        isVisible: true,
      })
    }

    // Auto-apply theme settings if template has them (merge with existing)
    if (tpl.themeSettings) {
      try {
        const currentThemeRes = await api.get<{ data: Record<string, unknown> }>('/settings/theme')
        const merged = { ...(currentThemeRes.data ?? {}), ...tpl.themeSettings }
        await api.put('/settings/theme', merged)
        toast.success(`"${tpl.name}" created! Theme auto-applied.`)
      } catch {
        toast.success(`"${tpl.name}" page created!`)
      }
    } else {
      toast.success(`"${tpl.name}" page created!`)
    }
    router.push(`/pages/${pageId}/edit`)
  } catch (err) {
    toast.error('Failed to create page from template')
  } finally {
    creating.value = null
  }
}
</script>
