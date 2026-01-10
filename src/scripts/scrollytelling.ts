import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollytelling() {
  // Only run on homepage
  if (window.location.pathname !== '/') {
    return;
  }

  const wrapper = document.getElementById('scrollytellingWrapper');
  const container = document.getElementById('scrollytellingContainer');
  const content = document.getElementById('scrollytellingContent');
  const wordsContainer = document.querySelector('.scrollytelling-words-container') as HTMLElement | null;
  const words = [
    document.getElementById('word-0'),
    document.getElementById('word-1'),
    document.getElementById('word-2'),
    document.getElementById('word-3')
  ];

  if (!wrapper || !container || !content || !wordsContainer || words.some(w => !w)) {
    return;
  }

  if (ScrollTrigger.getById('scrollytelling')) {
    return;
  }

  // ============================================
  // RESET - Clear everything
  // ============================================
  wordsContainer.classList.remove('is-ready');
  wordsContainer.style.cssText = '';

  words.forEach(word => {
    if (word) {
      word.classList.remove('is-active');
      word.style.cssText = '';
      gsap.set(word, { clearProps: 'all' });
    }
  });

  content.style.cssText = '';
  gsap.set(content, { clearProps: 'all' });

  // ============================================
  // INITIAL SETUP
  // ============================================
  wordsContainer.style.display = 'flex';
  wordsContainer.style.opacity = '0';
  wordsContainer.style.visibility = 'visible';

  // Content starts VISIBLE
  gsap.set(content, { autoAlpha: 1 });

  // All words hidden initially
  words.forEach(word => {
    gsap.set(word, {
      opacity: 0,
      visibility: 'visible',
      scale: 0.8,
      filter: 'blur(20px)'
    });
  });

  wordsContainer.classList.add('is-ready');

  // ============================================
  // TIMELINE CONFIGURATION
  // ============================================
  const enter = 0.25;
  const hold = 0.4;
  const exit = 0.5;
  const gap = 0.15;
  const cycle = enter + hold + exit + gap;

  const isMobile = window.innerWidth < 768;
  const flipScene = document.querySelector('.mobile-flip-scene');
  const flipFront = document.querySelector('.mobile-flip-front');
  const flipBack = document.querySelector('.mobile-flip-back');
  const hasMobileFlip = isMobile && flipScene && flipFront && flipBack;

  // Calculate total duration
  const contentFadeDuration = 0.5;
  const flipDuration = hasMobileFlip ? 1.0 : 0;
  const flipHold = hasMobileFlip ? 0.3 : 0;
  const fullCycles = (words.length - 1) * cycle;
  const lastWordTime = enter + hold;

  let total = contentFadeDuration + flipDuration + flipHold + fullCycles + lastWordTime;

  // Smaller multiplier = less scroll needed = faster animation
  const scrollMultiplier = isMobile ? 20 : 50;

  const tl = gsap.timeline({
    scrollTrigger: {
      id: 'scrollytelling',
      trigger: wrapper,
      start: 'top top',
      end: `+=${total * scrollMultiplier}%`,
      scrub: isMobile ? 0.2 : 0.8,
      pin: container,
      anticipatePin: 1,
      pinSpacing: true,
      onEnter: () => {
        wordsContainer.style.opacity = '1';
      },
      onLeaveBack: () => {
        wordsContainer.style.opacity = '0';
      }
    }
  });

  // ============================================
  // MOBILE: Flip sequence FIRST, then words
  // ============================================
  let wordsStartTime = contentFadeDuration + 0.1;

  if (hasMobileFlip) {
    // Setup flip card initial state
    gsap.set(flipFront, { rotationY: 0, opacity: 1, zIndex: 2 });
    gsap.set(flipBack, { rotationY: -180, opacity: 0, zIndex: 1 });

    // Flip happens first (after a brief hold on image)
    const flipStart = 0.2;

    tl.to(flipFront, {
      rotationY: 180,
      opacity: 0,
      duration: flipDuration,
      ease: 'power1.inOut'
    }, flipStart)
      .to(flipBack, {
        rotationY: 0,
        opacity: 1,
        duration: flipDuration,
        ease: 'power1.inOut'
      }, flipStart);

    // After flip completes, fade out content to show words
    const contentFadeStart = flipStart + flipDuration + flipHold;

    tl.to(content, {
      autoAlpha: 0,
      duration: contentFadeDuration,
      ease: 'power2.in'
    }, contentFadeStart);

    wordsStartTime = contentFadeStart + contentFadeDuration + 0.1;
  } else {
    // Desktop: Just fade out content directly
    tl.to(content, {
      autoAlpha: 0,
      duration: contentFadeDuration,
      ease: 'power2.in'
    }, 0);
  }

  // ============================================
  // WORDS ANIMATION
  // ============================================
  const lastWordIndex = words.length - 1;

  words.forEach((word, i) => {
    const start = wordsStartTime + (i * cycle);
    const isLastWord = (i === lastWordIndex);

    // Entrance
    tl.to(word, {
      autoAlpha: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: enter,
      ease: 'power2.out'
    }, start);

    // Hold
    tl.to(word, {
      autoAlpha: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: hold
    }, start + enter);

    // Exit - SKIP for last word
    if (!isLastWord) {
      tl.to(word, {
        autoAlpha: 0,
        scale: 0.6,
        filter: 'blur(15px)',
        duration: exit,
        ease: 'power1.in'
      }, start + enter + hold - 0.1);
    }
  });
}
