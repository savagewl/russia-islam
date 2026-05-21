'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import '../../styles/header.css'
import { useLang } from '@/lib/LanguageContext'
import { makeT } from '@/lib/translations'

interface HeaderProps {
  isMenuOpen?: boolean;
  onCloseMenu?: () => void;
}

export default function Header({ isMenuOpen, onCloseMenu }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [activeMenuItem, setActiveMenuItem] = useState('news-oic')
  const { lang } = useLang()
  const t = makeT('nav', lang)
  
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    if (isMenuOpen !== undefined) {
      setIsMobileOpen(isMenuOpen)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (pathname === '/') {
      setActiveMenuItem('news-oic')
    } else if (pathname === '/about-group') {
      setActiveMenuItem('about-group')
    } else if (pathname === '/islam-in-russia') {
      setActiveMenuItem('islam')
    } else if (pathname === '/contact') {
      setActiveMenuItem('contact')
    }
  }, [pathname])

  const closeMenu = () => {
    setIsMobileOpen(false)
    if (onCloseMenu) onCloseMenu()
  }

  const handleGroupClick = () => {
    setActiveMenuItem('about-group')
    closeMenu()
    if (pathname !== '/') {
      router.push('/?section=about-group')
    } else {
      window.dispatchEvent(new CustomEvent('groupClick'))
    }
  }

  const handleIslamClick = () => {
    setActiveMenuItem('islam')
    closeMenu()
    if (pathname !== '/') {
      router.push('/?section=islam')
    } else {
      window.dispatchEvent(new CustomEvent('islamClick'))
    }
  }

  const handleProjectsClick = () => {
    setActiveMenuItem('projects')
    closeMenu()
    if (pathname !== '/') {
      router.push('/?section=projects')
    } else {
      window.dispatchEvent(new CustomEvent('projectsClick'))
    }
  }

  const handleGrantsClick = () => {
    setActiveMenuItem('grants')
    closeMenu()
    if (pathname !== '/') {
      router.push('/?section=grants')
    } else {
      window.dispatchEvent(new CustomEvent('grantsClick'))
    }
  }

  const scrollToNews = () => {
    window.dispatchEvent(new CustomEvent('resetToHome'))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('newsOicClick'))
    }, 50)
  }

  const handleNewsOicClick = () => {
    setActiveMenuItem('news-oic')
    scrollToNews()
    closeMenu()
  }

  const handleNewsGroupClick = () => {
    setActiveMenuItem('news-group')
    scrollToNews()
    closeMenu()
  }

  const handleOpportunitiesClick = () => {
    setActiveMenuItem('opportunities')
    scrollToNews()
    closeMenu()
  }

  const handleEventsClick = () => {
    setActiveMenuItem('events')
    scrollToNews()
    closeMenu()
  }

  const handleExpertsClick = () => {
    setActiveMenuItem('experts')
    window.dispatchEvent(new CustomEvent('resetToHome'))
    setTimeout(() => {
      const expertsSection = document.querySelector('.experts-section')
      expertsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
    closeMenu()
  }

  const handleArticlesClick = () => {
    setActiveMenuItem('articles')
    window.dispatchEvent(new CustomEvent('resetToHome'))
    setTimeout(() => {
      const scientificSection = document.querySelector('.scientific-articles-section')
      scientificSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
    closeMenu()
  }

  const handleGroupMembersClick = () => {
    setActiveMenuItem('group-members')
    closeMenu()
    if (pathname !== '/') {
      router.push('/?section=group-members')
    } else {
      window.dispatchEvent(new CustomEvent('resetToHome'))
      setTimeout(() => {
        const groupMembersSection = document.querySelector('.group-members-section')
        groupMembersSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 50)
    }
  }

  return (
    <header className="main-header">
      <style>{`
        [dir="rtl"] .header-left {
          direction: ltr !important;
          flex-direction: row-reverse !important;
          justify-content: flex-start !important;
          width: 100% !important;
          margin-left: 0 !important;
          margin-right: 15px !important;
        }
        [dir="rtl"] .bottom-menu {
          direction: ltr !important;
          flex-direction: row-reverse !important;
          justify-content: flex-start !important;
          width: 100% !important;
        }
      `}</style>
      <div className={`nav-menus-wrapper ${isMobileOpen ? 'open' : ''}`}>
        <div className="header-top">
          <div className="header-container">
            <nav className="header-left">
              <button className="nav-button" onClick={handleGroupClick} translate="no">
                {t('about_group')}
              </button>
              <button className="nav-link" onClick={handleGroupMembersClick} translate="no">
                {t('group_members')}
              </button>
              <button className="nav-link" onClick={handleIslamClick} translate="no">
                {t('islam_in_russia')}
              </button>
              <Link href="/photo-video" className={`nav-link ${activeMenuItem === 'photo-video' ? 'active' : ''}`} onClick={() => { setActiveMenuItem('photo-video'); closeMenu(); }} translate="no">
                {t('photo_video')}
              </Link>
              <Link href="/contact" className={`nav-link ${activeMenuItem === 'contact' ? 'active' : ''}`} onClick={() => { setActiveMenuItem('contact'); closeMenu(); }} translate="no">
                {t('contact')}
              </Link>
            </nav>
          </div>
        </div>

        <div className="header-bottom">
          <div className="header-container">
            <nav className="bottom-menu">
              <Link
                href="/"
                className={`bottom-link ${activeMenuItem === 'news-oic' ? 'active' : ''}`}
                onClick={handleNewsOicClick}
                translate="no"
              >
                {t('news')}
              </Link>
              <Link
                href="/"
                className={`bottom-link ${activeMenuItem === 'news-group' ? 'active' : ''}`}
                onClick={handleNewsGroupClick}
                translate="no"
              >
                {t('group_news')}
              </Link>
              <Link
                href="#"
                className={`bottom-link ${activeMenuItem === 'projects' ? 'active' : ''}`}
                onClick={handleProjectsClick}
                translate="no"
              >
                {t('key_projects')}
              </Link>
              <Link
                href="#"
                className={`bottom-link ${activeMenuItem === 'grants' ? 'active' : ''}`}
                onClick={handleGrantsClick}
                translate="no"
              >
                {t('grants')}
              </Link>
              <Link
                href="/"
                className={`bottom-link ${activeMenuItem === 'opportunities' ? 'active' : ''}`}
                onClick={handleOpportunitiesClick}
                translate="no"
              >
                {t('opportunities')}
              </Link>
              <Link
                href="/"
                className={`bottom-link ${activeMenuItem === 'events' ? 'active' : ''}`}
                onClick={handleEventsClick}
                translate="no"
              >
                {t('events')}
              </Link>
              <Link
                href="/"
                className={`bottom-link ${activeMenuItem === 'experts' ? 'active' : ''}`}
                onClick={handleExpertsClick}
                translate="no"
              >
                {t('experts')}
              </Link>
              <Link
                href="/"
                className={`bottom-link ${activeMenuItem === 'articles' ? 'active' : ''}`}
                onClick={handleArticlesClick}
                translate="no"
              >
                {t('scientific_articles')}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}