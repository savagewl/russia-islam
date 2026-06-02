'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useLang } from '@/lib/LanguageContext'
import HeroSection from '@/components/home/HeroSection'
import NewsTicker from '@/components/home/NewsTicker'
import NewsSection from '@/components/home/NewsSection'
import ExpertsSection from '@/components/experts/ExpertsSection'
import ScientificArticlesSection from '@/components/scientific-section/ScientificArticlesSection'
import GroupMembersSection from '@/components/group-members/GroupMembersSection'
import AboutGroup from '@/components/about/AboutGroup'
import IslamInRussia from '@/components/islam/IslamInRussia'
import KeyProjects from '@/components/projects/KeyProjects'
import GrantsSection from '@/components/grants/GrantsSection'
import AppealsSection from '@/components/appeals/AppealsSection'

export default function Home() {
  const [showAboutGroup, setShowAboutGroup] = useState(false)
  const [showIslamInRussia, setShowIslamInRussia] = useState(false)
  const [showKeyProjects, setShowKeyProjects] = useState(false)
  const [showGrants, setShowGrants] = useState(false)
  const [showAppeals, setShowAppeals] = useState(false)
  const [activeSection, setActiveSection] = useState('news')
  const pathname = usePathname()
  const { lang } = useLang()

  const tickerTitles: Record<string, Record<string, string>> = {
    'about-group': { ru: 'О группе',           en: 'About the Group', ar: 'معلومات عن المجموعة' },
    'islam':       { ru: 'Ислам в России',      en: 'Islam in Russia', ar: 'الإسلام في روسيا' },
    'projects':    { ru: 'Ключевые проекты',    en: 'Key Projects',    ar: 'المشاريع الرئيسية' },
    'grants':      { ru: 'Гранты',              en: 'Grants',          ar: 'المنح' },
    'appeals':     { ru: 'Обращения',           en: 'Appeals',         ar: 'المناشدات' },
    'news':        { ru: 'Актуальные материалы',en: 'Current Materials',ar: 'المواد الراهنة' },
  }
  const tickerTitle = tickerTitles[activeSection]?.[lang] ?? tickerTitles[activeSection]?.['ru'] ?? 'Актуальные материалы'

  const newsSectionRef = useRef<HTMLDivElement>(null)
  const aboutGroupRef = useRef<HTMLDivElement>(null)
  const islamInRussiaRef = useRef<HTMLDivElement>(null)
  const keyProjectsRef = useRef<HTMLDivElement>(null)
  const grantsRef = useRef<HTMLDivElement>(null)
  const appealsRef = useRef<HTMLDivElement>(null)

  const resetAll = () => {
    setShowAboutGroup(false)
    setShowIslamInRussia(false)
    setShowKeyProjects(false)
    setShowGrants(false)
    setShowAppeals(false)
  }

  const handleGroupClick = () => {
    resetAll(); setShowAboutGroup(true); setActiveSection('about-group')
    setTimeout(() => aboutGroupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleIslamClick = () => {
    resetAll(); setShowIslamInRussia(true); setActiveSection('islam')
    setTimeout(() => islamInRussiaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleProjectsClick = () => {
    resetAll(); setShowKeyProjects(true); setActiveSection('projects')
    setTimeout(() => keyProjectsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleGrantsClick = () => {
    resetAll(); setShowGrants(true); setActiveSection('grants')
    setTimeout(() => grantsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleAppealsClick = () => {
    resetAll(); setShowAppeals(true); setActiveSection('appeals')
    setTimeout(() => appealsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleNewsOicClick = () => {
    resetAll(); setActiveSection('news')
    setTimeout(() => newsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const resetToHome = () => {
    resetAll(); setActiveSection('news')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('groupClick', handleGroupClick)
    window.addEventListener('islamClick', handleIslamClick)
    window.addEventListener('projectsClick', handleProjectsClick)
    window.addEventListener('grantsClick', handleGrantsClick)
    window.addEventListener('appealsClick', handleAppealsClick)
    window.addEventListener('newsOicClick', handleNewsOicClick)
    window.addEventListener('resetToHome', resetToHome)

    return () => {
      window.removeEventListener('groupClick', handleGroupClick)
      window.removeEventListener('islamClick', handleIslamClick)
      window.removeEventListener('projectsClick', handleProjectsClick)
      window.removeEventListener('grantsClick', handleGrantsClick)
      window.removeEventListener('appealsClick', handleAppealsClick)
      window.removeEventListener('newsOicClick', handleNewsOicClick)
      window.removeEventListener('resetToHome', resetToHome)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const section = params.get('section')
    if (section === 'about-group') {
      setTimeout(() => handleGroupClick(), 100)
    } else if (section === 'islam') {
      setTimeout(() => handleIslamClick(), 100)
    } else if (section === 'projects') {
      setTimeout(() => handleProjectsClick(), 100)
    } else if (section === 'grants') {
      setTimeout(() => handleGrantsClick(), 100)
    } else if (section === 'appeals') {
      setTimeout(() => handleAppealsClick(), 100)
    } else if (section === 'group-members') {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('resetToHome'))
        setTimeout(() => {
          const el = document.querySelector('.group-members-section')
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }, 100)
    }
    if (section) window.history.replaceState({}, '', '/')
  }, [])

  useEffect(() => {
    if (pathname === '/') { resetAll(); setActiveSection('news') }
  }, [pathname])

  const showNews = !showAboutGroup && !showIslamInRussia && !showKeyProjects && !showGrants && !showAppeals

  return (
    <main>
      <HeroSection onGroupClick={handleGroupClick} />
      <NewsTicker title={tickerTitle} />

      <div ref={newsSectionRef}>
        {showNews && (
          <>
            <NewsSection />
            <div className="white-divider"></div>
            <ExpertsSection />
            <div className="white-divider"></div>
            <ScientificArticlesSection category="scientific_articles" />
            <GroupMembersSection />
          </>
        )}
      </div>

      {showAboutGroup && (
        <div ref={aboutGroupRef} id="about-group"><AboutGroup /></div>
      )}

      {showIslamInRussia && (
        <div ref={islamInRussiaRef} id="islam-in-russia"><IslamInRussia /></div>
      )}

      {showKeyProjects && (
        <div ref={keyProjectsRef} id="key-projects"><KeyProjects /></div>
      )}

      {showGrants && (
        <div ref={grantsRef} id="grants"><GrantsSection /></div>
      )}

      {showAppeals && (
        <div ref={appealsRef} id="appeals"><AppealsSection /></div>
      )}
    </main>
  )
}
