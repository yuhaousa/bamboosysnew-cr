/* Vanilla JS for the static HTML export */

(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel)
  }

  function getStaticPathInfo() {
    const rawPath = String(window.location.pathname || '/')
    const path = rawPath.replace(/\\/g, '/').toLowerCase()

    const marker = '/static/'
    const idx = path.lastIndexOf(marker)
    if (idx === -1) {
      return { prefix: '', rel: '' }
    }

    const after = rawPath.replace(/\\/g, '/').slice(idx + marker.length)
    const parts = after.split('/').filter(Boolean)

    const file = parts[parts.length - 1] || ''
    const dirs = file.toLowerCase().endsWith('.html') ? parts.slice(0, -1) : parts
    const depth = Math.max(0, dirs.length)
    const prefix = Array(depth + 1).join('../')

    const rel = dirs.join('/')
    return { prefix, rel }
  }

  function joinPath(prefix, target) {
    const cleanPrefix = prefix || ''
    const cleanTarget = String(target || '').replace(/^\/+/, '')
    return cleanPrefix + cleanTarget
  }

  const navigation = [
    { name: 'Platform', target: 'index.html#platform', hasDropdown: false },
    { name: 'Features', target: 'features/index.html' },
    { name: 'AI Capabilities', target: 'ai-capabilities/index.html' },
    // { name: 'Integrations', target: 'integrations/index.html' },
    { name: 'Enterprise', target: 'enterprise/index.html' },
    { name: 'Case Studies', target: 'case-studies/index.html' },
    // { name: 'Contact Us', target: 'contact/index.html' },
  ]

  function isActiveLink(target, relPath) {
    if (!target) return false
    const cleanRel = String(relPath || '').replace(/^\/+/, '')

    if (target === 'index.html#platform') {
      return cleanRel === ''
    }

    const withoutHash = String(target).split('#')[0]
    const targetDir = withoutHash.endsWith('/index.html')
      ? withoutHash.slice(0, -'/index.html'.length)
      : withoutHash

    return targetDir ? cleanRel === targetDir : cleanRel === ''
  }

  function renderHeader(prefix, relPath) {
    const desktopLinks = navigation
      .map(function (item) {
        const active = isActiveLink(item.target, relPath)
        const cls =
          'flex items-center gap-1 text-sm font-medium transition-colors ' +
          (active
            ? 'text-foreground'
            : 'text-muted-foreground hover:text-foreground')
        const chevron = item.hasDropdown
          ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4"><path d="m6 9 6 6 6-6"/></svg>'
          : ''

        const href =
          item.target === 'index.html#platform'
            ? (prefix ? joinPath(prefix, 'index.html#platform') : '#platform')
            : joinPath(prefix, item.target)

        return '<a href="' + href + '" class="' + cls + '">' + item.name + chevron + '</a>'
      })
      .join('')

    const mobileLinks = navigation
      .map(function (item) {
        const href =
          item.target === 'index.html#platform'
            ? (prefix ? joinPath(prefix, 'index.html#platform') : '#platform')
            : joinPath(prefix, item.target)
        return (
          '<a href="' +
          href +
          '" class="block py-2 text-base font-medium text-muted-foreground hover:text-foreground">' +
          item.name +
          '</a>'
        )
      })
      .join('')

    return (
      '<header class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">' +
      '<nav class="mx-auto flex max-w-7xl items-center justify-between px-12 py-4 lg:px-16">' +
      '<div class="flex lg:flex-1">' +
      '<a href="' + joinPath(prefix, 'index.html') + '" class="flex items-center gap-2">' +
      '<img src="' + joinPath(prefix, 'images/bamboologo.png') + '" alt="Bamboo" class="h-16 w-auto" />' +
      '</a>' +
      '</div>' +
      '<div class="flex lg:hidden">' +
      '<button type="button" class="inline-flex items-center justify-center rounded-md p-2.5 text-foreground" data-mobile-nav-toggle aria-expanded="false">' +
      '<span class="sr-only">Open main menu</span>' +
      '<svg data-icon="menu" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line></svg>' +
      '<svg data-icon="close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" style="display:none"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>' +
      '</button>' +
      '</div>' +
      '<div class="hidden lg:flex lg:gap-x-8">' +
      desktopLinks +
      '</div>' +
      '<div class="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">' +
      // '<a href="#" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">Sign in</a>' +
      '<a href="' +
  (prefix ? joinPath(prefix, '/contact/index.html') : 'contact/index.html') +
'" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">Contact Us</a>' +
      '</div>' +
      '</nav>' +
      '<div class="lg:hidden bg-background border-b border-border" data-mobile-nav-panel hidden>' +
      '<div class="space-y-1 px-12 py-4">' +
      mobileLinks +
      '<div class="pt-4 flex flex-col gap-2">' +
      // '<a href="#" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full justify-center">Sign in</a>' +
      '<a href="' +
  (prefix ? joinPath(prefix, '/contact/index.html') : 'contact/index.html') +
'" class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 w-full justify-center">Contact Us</a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</header>'
    )
  }

  function renderFooter(prefix) {
    return (
      '<footer class="bg-foreground">' +
      '<div class="mx-auto max-w-7xl px-6 py-16 lg:px-8">' +
      '<div class="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">' +
      '<div class="col-span-2 lg:col-span-1">' +
      '<a href="' + joinPath(prefix, 'index.html') + '" class="flex items-center gap-2">' +
      '<img src="' + joinPath(prefix, 'images/bamboologo.png') + '" alt="Bamboo" class="h-16 w-auto" />' +
      '</a>' +
      '<p class="mt-4 text-sm text-background/60 max-w-xs">The #1 AI-powered learning platform for enterprises worldwide.</p>' +
      '</div>' +
      '<div><h3 class="text-sm font-semibold text-background">Platform</h3><ul class="mt-4 space-y-3">' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Features</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Integrations</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">AI Capabilities</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Mobile App</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Security</a></li>' +
      '</ul></div>' +
      '<div><h3 class="text-sm font-semibold text-background">Solutions</h3><ul class="mt-4 space-y-3">' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Enterprise</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Small Business</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Education</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Government</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Healthcare</a></li>' +
      '</ul></div>' +
      '<div><h3 class="text-sm font-semibold text-background">Resources</h3><ul class="mt-4 space-y-3">' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Blog</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Case Studies</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Webinars</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Documentation</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">API Reference</a></li>' +
      '</ul></div>' +
      '<div><h3 class="text-sm font-semibold text-background">Company</h3><ul class="mt-4 space-y-3">' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">About Us</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Careers</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Press</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Partners</a></li>' +
      '<li><a href="#" class="text-sm text-background/60 hover:text-background transition-colors">Contact</a></li>' +
      '</ul></div>' +
      '</div>' +
      '<div class="mt-16 pt-8 border-t border-background/10">' +
      '<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">' +
      '<p class="text-sm text-background/60">© 2025 Learnify AI. All rights reserved.</p>' +
      '<div class="flex gap-6">' +
      '<a href="#" class="text-sm text-background/60 hover:text-background">Privacy Policy</a>' +
      '<a href="#" class="text-sm text-background/60 hover:text-background">Terms of Service</a>' +
      '<a href="#" class="text-sm text-background/60 hover:text-background">Cookie Settings</a>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</footer>'
    )
  }

  function injectLayout() {
    const headerMount = qs('[data-site-header]')
    const footerMount = qs('[data-site-footer]')
    if (!headerMount && !footerMount) return

    const info = getStaticPathInfo()
    if (headerMount) headerMount.innerHTML = renderHeader(info.prefix, info.rel)
    if (footerMount) footerMount.innerHTML = renderFooter(info.prefix)
  }

  function initMobileNav() {
    const toggle = qs('[data-mobile-nav-toggle]')
    const panel = qs('[data-mobile-nav-panel]')
    if (!toggle || !panel) return

    function setOpen(open) {
      panel.hidden = !open
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
      const iconOpen = qs('[data-icon="menu"]', toggle)
      const iconClose = qs('[data-icon="close"]', toggle)
      if (iconOpen) iconOpen.style.display = open ? 'none' : 'block'
      if (iconClose) iconClose.style.display = open ? 'block' : 'none'
    }

    setOpen(false)

    toggle.addEventListener('click', function () {
      const open = toggle.getAttribute('aria-expanded') === 'true'
      setOpen(!open)
    })

    panel.addEventListener('click', function (e) {
      const a = e.target && e.target.closest && e.target.closest('a')
      if (a) setOpen(false)
    })
  }

  function initHeroSlider() {
    const root = qs('[data-hero]')
    if (!root) return

    const info = getStaticPathInfo()

    const slides = [
      {
        image: joinPath(info.prefix, 'images/professional-business-people-walking-in-modern-off.jpg'),
        title: 'The #1',
        highlight: 'AI-powered',
        subtitle: 'learning platform',
        description:
          "Transform how your organization learns with intelligent personalization, AI-generated content, and insights that drive real business impact.",
      },
      {
        image: joinPath(info.prefix, 'images/diverse-employees-learning-on-laptops-in-corporate.jpg'),
        title: 'Embrace',
        highlight: 'AI & Future',
        subtitle: 'of learning',
        description:
          "Stay ahead of the curve with cutting-edge AI technology that adapts to emerging skills, predicts learning needs, and prepares your workforce for tomorrow's challenges.",
      },
      {
        image: joinPath(info.prefix, 'images/futuristic-ai-technology-interface-with-people-wor.jpg'),
        title: 'We make every',
        highlight: 'workplace',
        subtitle: 'a learning place',
        description:
          'Seamlessly integrate learning into daily workflows. Empower employees to grow, collaborate, and excel—right where they work, when they need it most.',
      },
    ]

    const bgEls = Array.prototype.slice.call(root.querySelectorAll('[data-hero-bg]'))
    const dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'))
    const titleEl = qs('[data-hero-title]', root)
    const highlightEl = qs('[data-hero-highlight]', root)
    const subtitleEl = qs('[data-hero-subtitle]', root)
    const descEl = qs('[data-hero-desc]', root)

    if (!titleEl || !highlightEl || !subtitleEl || !descEl || bgEls.length !== slides.length) return

    let idx = 0
    let timer = null

    function render() {
      bgEls.forEach(function (el, i) {
        el.style.backgroundImage = "url('" + slides[i].image + "')"
        el.style.opacity = i === idx ? '0.7' : '0'
      })

      titleEl.textContent = slides[idx].title + ' '
      highlightEl.textContent = slides[idx].highlight
      subtitleEl.textContent = slides[idx].subtitle
      descEl.textContent = slides[idx].description

      dots.forEach(function (el, i) {
        const active = i === idx
        el.classList.toggle('bg-primary', active)
        el.classList.toggle('w-6', active)
        el.classList.toggle('bg-background/50', !active)
        el.classList.toggle('hover:bg-background/70', !active)
      })
    }

    function go(next) {
      idx = (next + slides.length) % slides.length
      render()
    }

    dots.forEach(function (el, i) {
      el.addEventListener('click', function () {
        go(i)
        restart()
      })
    })

    function restart() {
      if (timer) clearInterval(timer)
      timer = setInterval(function () {
        go(idx + 1)
      }, 5000)
    }

    render()
    restart()
  }

  function initContactForm() {
    const form = qs('[data-contact-form]')
    if (!form) return

    const success = qs('[data-contact-success]')
    const again = qs('[data-contact-again]')
    if (!success || !again) return

    function setSubmitted(submitted) {
      form.hidden = submitted
      success.hidden = !submitted
    }

    setSubmitted(false)

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      setSubmitted(true)
    })

    again.addEventListener('click', function () {
      setSubmitted(false)
      try {
        form.reset()
      } catch (_) {
        // ignore
      }
    })
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectLayout()
    initMobileNav()
    initHeroSlider()
    initContactForm()
  })
})()
