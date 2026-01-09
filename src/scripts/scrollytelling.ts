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
  // STEP 0: FULL RESET - Clear everything
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
  // STEP 1: Setup container (invisible initially)
  // ============================================
  wordsContainer.style.display = 'flex';
  wordsContainer.style.opacity = '0';
  wordsContainer.style.visibility = 'visible';

  // ============================================
  // STEP 2: Activate words visibility via CSS class
  // ============================================
  // words.forEach(word => word?.classList.add('is-active')); // REMOVED: Managed by GSAP internally

  // ============================================
  // STEP 3: Apply GSAP initial states with INLINE STYLES
  // First word visible, others hidden
  // ============================================

  // First word: Start HIDDEN to prevent flash on load
  // Will be revealed in onEnter
  gsap.set(words[0], {
    opacity: 0,
    visibility: 'hidden',
    scale: 1,
    filter: 'blur(0px)'
  });

  // Other words: hidden
  for (let i = 1; i < words.length; i++) {
    gsap.set(words[i], {
      opacity: 0,
      visibility: 'visible',
      scale: 0.8,
      filter: 'blur(20px)'
    });
  }

  // Content: hidden
  gsap.set(content, {
    autoAlpha: 0, // Using autoAlpha for consistency
    // Removed scale/blur initial state
  });

  // ============================================
  // STEP 4: Reveal container - REMOVED TO PREVENT GHOSTING
  // We let ScrollTrigger control visibility to avoid seeing static element before pinning
  // ============================================
  // wordsContainer.style.opacity = '1';
  wordsContainer.classList.add('is-ready');

  // ============================================
  // STEP 5: Create ScrollTrigger timeline
  // ============================================
  const enter = 0.25;
  const hold = 0.4;
  const exit = 0.5;
  const gap = 0.15;
  const cycle = enter + hold + exit + gap;

  // Reduce scroll distance on mobile
  const isMobile = window.innerWidth < 768;

  // Calculate total duration
  let total = words.length * cycle + 0.8;

  // Extend timeline space for Mobile Flip sequence if it exists
  if (isMobile && document.querySelector('.mobile-flip-scene')) {
    total += 2.5; // Add cycles for the flip animation
  }

  // Reduced multipliers for more sensitivity (less scrolling required)
  const scrollMultiplier = isMobile ? 35 : 75; // Even more sensitive for mobile

  const tl = gsap.timeline({
    scrollTrigger: {
      id: 'scrollytelling',
      trigger: wrapper,
      start: 'top top',
      end: `+=${total * scrollMultiplier}%`,
      scrub: isMobile ? 0.3 : 0.8, // Lower scrub = faster response on mobile
      pin: container,
      anticipatePin: 1,
      pinSpacing: true,
      onEnter: () => {
        // Show container ONLY when we enter the section
        wordsContainer.style.opacity = '1';
      },
      onLeaveBack: () => {
        // HIDE container completely when above the section
        wordsContainer.style.opacity = '0';

        // Force hide content to prevent any flicker/leak at the start
        gsap.set(content, { autoAlpha: 0 });
      }
    }
  });

  // ============================================
  // Animate words
  // ============================================
  words.forEach((word, i) => {
    const start = i * cycle;

    // Entrance (Apply to ALL words, including the first one)
    tl.to(word, {
      autoAlpha: 1, // Handles opacity AND visibility
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

    // Exit
    tl.to(word, {
      autoAlpha: 0, // Sets visibility: hidden at end
      scale: 0.6,
      filter: 'blur(15px)',
      duration: exit,
      ease: 'power1.in'
    }, start + enter + hold - 0.1);
  });

  // ============================================
  // Final transition - smooth crossfade
  // ============================================
  const final = words.length * cycle;
  const crossfadeDuration = 0.6;

  // Start showing content BEFORE hiding words for smooth crossfade
  tl.to(content, {
    autoAlpha: 1, // Handles opacity and visibility perfectly
    duration: crossfadeDuration,
    ease: 'power2.out'
  }, final);

  // Fade out words container simultaneously
  tl.to(wordsContainer, {
    opacity: 0,
    duration: crossfadeDuration,
    ease: 'power2.in'
  }, final);

  // ============================================
  // MOBILE FLIP CARD SEQUENCE (Optimized Unified Timeline)
  // ============================================
  if (isMobile) {
    const flipScene = document.querySelector('.mobile-flip-scene');
    const flipFront = document.querySelector('.mobile-flip-front');
    const flipBack = document.querySelector('.mobile-flip-back');

    if (flipScene && flipFront && flipBack) {
      // 1. Initial State (Nuclear Setup)
      gsap.set(flipFront, { rotationY: 0, opacity: 1, zIndex: 2 });
      gsap.set(flipBack, { rotationY: -180, opacity: 0, zIndex: 1 });

      // 2. Add extra scroll distance for the flip interaction
      // The flip happens AFTER content is revealed
      const flipStart = final + crossfadeDuration + 0.2; // Small pause to see the image
      const flipDuration = 1.5; // Duration relative to scroll distance

      // 3. FLIP Animation linked to scroll (Scrubbed)
      // Visual feedback: Image Front -> Image Back
      tl.to(flipFront, {
        rotationY: 180,
        opacity: 0, // Crossfade opacity for robustness
        duration: flipDuration,
        ease: 'power1.inOut'
      }, flipStart)
        .to(flipBack, {
          rotationY: 0,
          opacity: 1,
          duration: flipDuration,
          ease: 'power1.inOut'
        }, flipStart);
    }
  }
}

