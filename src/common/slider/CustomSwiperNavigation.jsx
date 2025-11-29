'use client';

import React, { useState, useEffect } from 'react';
import { useSwiper } from 'swiper/react';
import styles from '@/styles/CustomSwiperNavigation.module.css';

export default function CustomSwiperNavigation() {
  const swiper = useSwiper();
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesCount, setSlidesCount] = useState(0);

  useEffect(() => {
    if (swiper) {
      // Get the actual number of slides excluding the last empty slide
      const actualSlideCount = swiper.slides.length - 1;
      setSlidesCount(actualSlideCount);

      const handleSlideChange = () => {
        // Ensure we don't count the last empty slide in the active index
        const currentIndex = swiper.activeIndex >= actualSlideCount ? 0 : swiper.activeIndex;
        setActiveIndex(currentIndex);
      };

      swiper.on('slideChange', handleSlideChange);

      // Initial call to set correct active index
      handleSlideChange();

      return () => {
        swiper.off('slideChange', handleSlideChange);
      };
    }
  }, [swiper]);

  return (
    <div className={styles.navigationContainer + " mt-5"}>
      <button
        onClick={() => swiper.slidePrev()}
        className={styles.navigationButton}
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <div className={styles.paginationContainer}>
        {[...Array(slidesCount)].map((_, index) => (
          <button
            key={index}
            onClick={() => swiper.slideTo(index)}
            className={`${styles.paginationDot} ${
              activeIndex === index ? styles.paginationDotActive : ''
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={() => swiper.slideNext()}
        className={styles.navigationButton}
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
