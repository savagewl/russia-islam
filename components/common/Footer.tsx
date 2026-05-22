'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import '../../styles/footer.css';
import { subscribeEmail } from '@/lib/api';
import { useLang } from '@/lib/LanguageContext';
import { makeT } from '@/lib/translations';

const COOLDOWN_MS = 5 * 60 * 1000
const COOLDOWN_KEY = 'email_subscribe_cooldown'

const formatCooldown = (ms: number) => {
  const s = Math.ceil(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { lang } = useLang();
  const t = makeT('footer', lang)
  const tNav = makeT('nav', lang)
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [subMessage, setSubMessage] = useState('')
  const [cooldownEnd, setCooldownEnd] = useState<number | null>(null)
  const [cooldownLeft, setCooldownLeft] = useState(0)

  useEffect(() => {
    const stored = localStorage.getItem(COOLDOWN_KEY)
    if (stored) {
      const end = parseInt(stored, 10)
      if (end > Date.now()) {
        setCooldownEnd(end)
        setCooldownLeft(end - Date.now())
      } else {
        localStorage.removeItem(COOLDOWN_KEY)
      }
    }
  }, [])

  useEffect(() => {
    if (!cooldownEnd) return
    const interval = setInterval(() => {
      const left = cooldownEnd - Date.now()
      if (left <= 0) {
        setCooldownEnd(null)
        setCooldownLeft(0)
        localStorage.removeItem(COOLDOWN_KEY)
      } else {
        setCooldownLeft(left)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [cooldownEnd])

  const handleSubscribe = async () => {
    if (cooldownEnd) return
    if (!email.trim()) return
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setSubStatus('error')
      setSubMessage(t('invalid_email'))
      return
    }
    setSubStatus('loading')
    try {
      await subscribeEmail(email)
      setSubStatus('success')
      setSubMessage(t('success'))
      setEmail('')
      const end = Date.now() + COOLDOWN_MS
      localStorage.setItem(COOLDOWN_KEY, end.toString())
      setCooldownEnd(end)
      setCooldownLeft(COOLDOWN_MS)
    } catch {
      setSubStatus('error')
      setSubMessage(t('error'))
    }
  }

  const navigateToSection = (event: string, section: string) => {
    if (pathname === '/') {
      window.dispatchEvent(new CustomEvent(event));
    } else {
      router.push(`/?section=${section}`);
    }
  };

  const handleGroupClick = () => navigateToSection('groupClick', 'about-group');
  const handleIslamClick = () => navigateToSection('islamClick', 'islam');
  const handleProjectsClick = () => navigateToSection('projectsClick', 'projects');
  const handleGrantsClick = () => navigateToSection('grantsClick', 'grants');

  const scrollToNews = () => {
    if (pathname === '/') {
      window.dispatchEvent(new CustomEvent('resetToHome'));
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('newsOicClick'));
      }, 50);
    } else {
      router.push('/');
    }
  };

  const handleNewsOicClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToNews();
  };

  const handleNewsGroupClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToNews();
  };

  const handleOpportunitiesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToNews();
  };

  const handleEventsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToNews();
  };

  const handleExpertsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      window.dispatchEvent(new CustomEvent('resetToHome'));
      setTimeout(() => {
        const expertsSection = document.querySelector('.experts-section');
        expertsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      router.push('/?section=experts');
    }
  };

  const handleArticlesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      window.dispatchEvent(new CustomEvent('resetToHome'));
      setTimeout(() => {
        const scientificSection = document.querySelector('.scientific-articles-section');
        scientificSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      router.push('/articles');
    }
  };

  const handleGroupMembersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === '/') {
      window.dispatchEvent(new CustomEvent('resetToHome'));
      setTimeout(() => {
        const groupMembersSection = document.querySelector('.group-members-section');
        groupMembersSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      router.push('/?section=group-members');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-column">
            <h3 className="footer-title" translate="no">{t('about_portal')}</h3>
            <ul className="footer-links">
              <li>
                <button onClick={handleGroupClick} className="footer-link" translate="no">
                  {t('about_group_full')}
                </button>
              </li>
              <li>
                <button onClick={handleIslamClick} className="footer-link" translate="no">
                  {tNav('islam_in_russia')}
                </button>
              </li>
              <li>
                <button onClick={handleGroupMembersClick} className="footer-link" translate="no">
                  {tNav('group_members')}
                </button>
              </li>
              <li>
                <button onClick={handleExpertsClick} className="footer-link" translate="no">
                  {tNav('experts')}
                </button>
              </li>
              <li>
                <Link href="/contact" className="footer-link" translate="no">
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title" translate="no">{t('news_section')}</h3>
            <ul className="footer-links">
              <li>
                <button onClick={handleNewsOicClick} className="footer-link" translate="no">
                  {tNav('news')}
                </button>
              </li>
              <li>
                <button onClick={handleNewsGroupClick} className="footer-link" translate="no">
                  {tNav('group_news')}
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3 className="footer-title" translate="no">{t('projects_section')}</h3>
            <ul className="footer-links">
              <li>
                <button onClick={handleProjectsClick} className="footer-link" translate="no">
                  {tNav('key_projects')}
                </button>
              </li>
              <li>
                <button onClick={handleOpportunitiesClick} className="footer-link" translate="no">
                  {tNav('opportunities')}
                </button>
              </li>
              <li>
                <button onClick={handleEventsClick} className="footer-link" translate="no">
                  {t('events_link')}
                </button>
              </li>
              <li>
                <button onClick={handleArticlesClick} className="footer-link" translate="no">
                  {tNav('scientific_articles')}
                </button>
              </li>
              <li>
                <button onClick={handleGrantsClick} className="footer-link" translate="no">
                  {tNav('grants')}
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <div className="subscription-container">
              <span className="subscription-title" translate="no">{t('subscribe_title')}</span>
              <span className="subscription-subtitle" translate="no">{t('subscribe_subtitle')}</span>
              {subStatus === 'success' ? (
                <div style={{ color: '#fff', fontSize: 14, textAlign: 'center', padding: '12px 0' }}>
                  ✓ {subMessage}
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    className="subscription-input"
                    placeholder={t('email_placeholder')}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (subStatus !== 'idle') setSubStatus('idle')
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                    disabled={subStatus === 'loading'}
                  />
                  {subStatus === 'error' && (
                    <span style={{ color: '#ffcccc', fontSize: 11, marginTop: -4 }}>{subMessage}</span>
                  )}
                  <button
                    className="subscription-button"
                    onClick={handleSubscribe}
                    disabled={subStatus === 'loading' || !!cooldownEnd}
                    style={{ opacity: (subStatus === 'loading' || cooldownEnd) ? 0.7 : 1 }}
                  >
                    {cooldownEnd ? formatCooldown(cooldownLeft) : subStatus === 'loading' ? t('sending') : t('subscribe_btn')}
                  </button>
                </>
              )}
            </div>
            
            <div className="social-icons">
              <a href="https://www.facebook.com/arabic.rusisworld" className="social-icon-link" aria-label="Facebook">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M32 0H0V32H32V0Z" fill="#1877F2"/>
                <path d="M24 16C24 11.6 20.4 8 16 8C11.6 8 8 11.6 8 16C8 20 10.9 23.3 14.7 23.9V18.3H12.7V16H14.7V14.2C14.7 12.2 15.9 11.1 17.7 11.1C18.6 11.1 19.5 11.3 19.5 11.3V13.3H18.5C17.5 13.3 17.2 13.9 17.2 14.5V16H19.4L19 18.3H17.1V24C21.1 23.4 24 20 24 16Z" fill="white"/>
              </svg>
            </a>
            <a href="https://x.com/RuIslWorld" className="social-icon-link" aria-label="Twitter">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M32 0H0V32H32V0Z" fill="#1DA1F2"/>
                <path d="M24 11C23.4 11.3 22.8 11.4 22.1 11.5C22.8 11.1 23.3 10.5 23.5 9.7C22.9 10.1 22.2 10.3 21.4 10.5C20.8 9.9 19.9 9.5 19 9.5C16.9 9.5 15.3 11.5 15.8 13.5C13.1 13.4 10.7 12.1 9 10.1C8.1 11.6 8.6 13.5 10 14.5C9.5 14.5 9 14.3 8.5 14.1C8.5 15.6 9.6 17 11.1 17.4C10.6 17.5 10.1 17.6 9.6 17.5C10 18.8 11.2 19.8 12.7 19.8C11.5 20.7 9.7 21.2 8 21C9.5 21.9 11.2 22.5 13 22.5C19.1 22.5 22.5 17.4 22.3 12.7C23 12.3 23.6 11.7 24 11Z" fill="white"/>
              </svg>
            </a>
            <a href="https://vk.com/gsvriw" className="social-icon-link" aria-label="VK">
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M32 0H0V32H32V0Z" fill="#1976d2"/>
    <path d="M23.96 12.03C24 11.93 24.02 11.84 24.01 11.76C24 11.51 23.82 11.34 23.43 11.34H21.68C21.24 11.34 21.04 11.6 20.92 11.87C20.92 11.87 19.83 14.11 18.58 15.55C18.17 16 18 15.99 17.78 15.99C17.63 15.99 17.33 15.86 17.33 15.47V11.34C17.33 10.88 17.22 10.67 16.85 10.67H13.75C13.47 10.67 13.33 10.88 13.33 11.09C13.33 11.54 13.93 11.65 14 12.89V16.01C14 16.56 13.9 16.67 13.68 16.67C13.09 16.67 11.92 14.67 11.12 11.96C10.96 11.53 10.8 11.34 10.36 11.34H8.6C8.08 11.34 8 11.58 8 11.85C8 12.33 8.4 14.93 10.58 18.07C12.17 20.08 14.26 21.34 16.1 21.34C17.22 21.34 17.33 21.05 17.33 20.61V18.63C17.33 18.09 17.45 17.98 17.81 17.98C18.07 17.98 18.58 18.15 19.58 19.34C20.73 20.68 20.94 21.34 21.61 21.34H23.36C23.77 21.34 23.97 21.05 23.85 20.64C23.72 20.26 23.12 19.32 22.38 18.42C21.97 17.92 21.57 17.43 21.38 17.17C21.11 16.91 21.19 16.78 21.38 16.51C21.38 16.51 24.02 13.1 23.96 12.03Z" fill="white"/>
  </svg>
</a>
            
            <a href="https://www.instagram.com/rusislworld?igsh=d3NkNG92cGhhZmg=" className="social-icon-link" aria-label="Instagram">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M32 0H0V32H32V0Z" fill="#F00073"/>
                <path d="M16 9.2C18.2 9.2 18.5 9.2 19.4 9.2C20.2 9.2 20.6 9.4 20.9 9.5C21.3 9.7 21.6 9.8 21.9 10.1C22.2 10.4 22.4 10.7 22.5 11.1C22.6 11.4 22.7 11.8 22.8 12.6C22.8 13.5 22.8 13.7 22.8 16C22.8 18.3 22.8 18.5 22.8 19.4C22.8 20.2 22.6 20.6 22.5 20.9C22.3 21.3 22.2 21.6 21.9 21.9C21.6 22.2 21.3 22.4 20.9 22.5C20.6 22.6 20.2 22.7 19.4 22.8C18.5 22.8 18.3 22.8 16 22.8C13.7 22.8 13.5 22.8 12.6 22.8C11.8 22.8 11.4 22.6 11.1 22.5C10.7 22.3 10.4 22.2 10.1 21.9C9.8 21.6 9.6 21.3 9.5 20.9C9.4 20.6 9.3 20.2 9.2 19.4C9.2 18.5 9.2 18.3 9.2 16C9.2 13.7 9.2 13.5 9.2 12.6C9.2 11.8 9.4 11.4 9.5 11.1C9.7 10.7 9.8 10.4 10.1 10.1C10.4 9.8 10.7 9.6 11.1 9.5C11.4 9.4 11.8 9.3 12.6 9.2C13.5 9.2 13.8 9.2 16 9.2ZM16 7.7C13.7 7.7 13.5 7.7 12.6 7.7C11.7 7.7 11.1 7.9 10.6 8.1C10.1 8.3 9.6 8.6 9.1 9.1C8.6 9.6 8.4 10 8.1 10.6C7.9 11.1 7.8 11.7 7.7 12.6C7.7 13.5 7.7 13.8 7.7 16C7.7 18.3 7.7 18.5 7.7 19.4C7.7 20.3 7.9 20.9 8.1 21.4C8.3 21.9 8.6 22.4 9.1 22.9C9.6 23.4 10 23.6 10.6 23.9C11.1 24.1 11.7 24.2 12.6 24.3C13.5 24.3 13.8 24.3 16 24.3C18.2 24.3 18.5 24.3 19.4 24.3C20.3 24.3 20.9 24.1 21.4 23.9C21.9 23.7 22.4 23.4 22.9 22.9C23.4 22.4 23.6 22 23.9 21.4C24.1 20.9 24.2 20.3 24.3 19.4C24.3 18.5 24.3 18.2 24.3 16C24.3 13.8 24.3 13.5 24.3 12.6C24.3 11.7 24.1 11.1 23.9 10.6C23.7 10.1 23.4 9.6 22.9 9.1C22.4 8.6 22 8.4 21.4 8.1C20.9 7.9 20.3 7.8 19.4 7.7C18.5 7.7 18.3 7.7 16 7.7Z" fill="white"/>
                <path d="M16 11.7C13.6 11.7 11.7 13.6 11.7 16C11.7 18.4 13.6 20.3 16 20.3C18.4 20.3 20.3 18.4 20.3 16C20.3 13.6 18.4 11.7 16 11.7ZM16 18.8C14.5 18.8 13.2 17.6 13.2 16C13.2 14.5 14.4 13.2 16 13.2C17.5 13.2 18.8 14.4 18.8 16C18.8 17.5 17.5 18.8 16 18.8Z" fill="white"/>
                <path d="M20.4 12.6C20.952 12.6 21.4 12.152 21.4 11.6C21.4 11.048 20.952 10.6 20.4 10.6C19.848 10.6 19.4 11.048 19.4 11.6C19.4 12.152 19.848 12.6 20.4 12.6Z" fill="white"/>
              </svg>
            </a>

            <a href="https://rutube.ru/channel/74282545/videos/ " className="social-icon" target="_blank" rel="noopener noreferrer">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 0H0V32H32V0Z" fill="#100943"/>
                  <path d="M32 16C40.8366 16 48 8.83656 48 7.62939e-06C48 -8.83656 40.8366 -16 32 -16C23.1634 -16 16 -8.83656 16 7.62939e-06C16 8.83656 23.1634 16 32 16Z" fill="#ED143B"/>
                  <path d="M19.7663 15.2695H10.3123V11.5284H19.7663C20.3185 11.5284 20.7025 11.6247 20.8952 11.7928C21.0879 11.9608 21.2072 12.2726 21.2072 12.728V14.0713C21.2072 14.5511 21.0879 14.8629 20.8952 15.031C20.7025 15.1991 20.3185 15.2709 19.7663 15.2709V15.2695ZM20.4149 8.00143H6.30298V24H10.3123V18.795H17.7012L21.2072 24H25.6969L21.8314 18.7706C23.2565 18.5594 23.8964 18.1227 24.4242 17.4029C24.9519 16.6831 25.2167 15.5324 25.2167 13.9966V12.797C25.2167 11.8861 25.1202 11.1664 24.952 10.6147C24.7837 10.063 24.4962 9.5832 24.0877 9.15219C23.6563 8.74419 23.176 8.45685 22.5993 8.26434C22.0226 8.09627 21.3022 8 20.4149 8V8.00143Z" fill="white"/>
                </svg>
              </a>
              <a href="#" className="social-icon-link" aria-label="YouTube">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M32 0H0V32H32V0Z" fill="#FF0000"/>
                <path d="M23.6 12.1C23.4 11.4 22.9 10.9 22.2 10.7C21 10.4 15.9 10.4 15.9 10.4C15.9 10.4 10.9 10.4 9.6 10.7C8.9 10.9 8.4 11.4 8.2 12.1C8 13.4 8 16 8 16C8 16 8 18.6 8.3 19.9C8.5 20.6 9 21.1 9.7 21.3C10.9 21.6 16 21.6 16 21.6C16 21.6 21 21.6 22.3 21.3C23 21.1 23.5 20.6 23.7 19.9C24 18.6 24 16 24 16C24 16 24 13.4 23.6 12.1ZM14.4 18.4V13.6L18.6 16L14.4 18.4Z" fill="white"/>
              </svg>
            </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copyright" translate="no">{t('copyright')}</div>
          <div className="footer-legal" translate="no">
            <Link href="https://acrelis.ru/">{t('made_by')}</Link>
          </div>
          <div className="footer-legal" translate="no">
            <Link href="/privacy">{t('privacy')}</Link>
            <Link href="/terms">{t('terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;