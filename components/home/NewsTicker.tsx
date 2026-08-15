'use client'

import React from 'react';
import '../../styles/newsTicker.css';

interface NewsTickerProps {
  title?: string; 
}

export default function NewsTicker({ title = 'Актуальные материалы' }: NewsTickerProps) {
  return (
    <div className="news-ticker">
      <div className="container">
        <div className="ticker-content">
          <span className="ticker-text" translate="no">{title}</span>
        </div>
      </div>
    </div>
  )
}