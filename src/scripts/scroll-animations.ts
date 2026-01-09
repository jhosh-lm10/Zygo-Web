/**
 * Scroll reveal animations for Astro + GSAP.
 * Designed to work correctly with View Transitions.
 */

import gsap from 'gsap';

let observer: IntersectionObserver | null = null;
let isInitialized = false;
const animatedSet = new Set<Element>();

function getDelay(el: HTMLElement): number {
  const delay = el.dataset.animateDelay;
  return delay ? parseFloat(delay) || 0 : 0;
}

function getInitialState(variant: string): gsap.TweenVars {
  const from: gsap.TweenVars = { autoAlpha: 0 };
  switch (variant) {
    case 'left':
      from.x = -60;
      from.filter = 'blur(5px)';
      break;
    case 'right':
      from.x = 60;
      from.filter = 'blur(5px)';
      break;
    case 'scale':
      from.scale = 0.8;
      from.filter = 'blur(5px)';
      break;
    case 'fade':
      from.filter = 'blur(10px)';
      break;
    case 'pop':
      from.scale = 0.95;
      from.y = 30;
      from.filter = 'blur(0px)'; // Explicitly force no blur
      // No blur for this one, per user request for "different"
      break;
    case 'soft-slide':
      // PREMIUM SERVICE VARIANT (User Feedback: "Make it obvious")
      from.x = 80; // Slide in from RIGHT
      from.y = 0;  // No vertical move to differentiate from "Up"
      from.scale = 0.95; // Slight zoom
      from.filter = 'blur(5px)';
      // Removed rotation to keep it clean
      break;
    default: // 'up'
      from.y = 50;
      from.filter = 'blur(5px)';
  }
  return from;
}

function playAnimation(el: HTMLElement) {
  if (animatedSet.has(el)) return;
  animatedSet.add(el);

  const delay = getDelay(el);

  gsap.to(el, {
    autoAlpha: 1,
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0, // Reset rotation if used
    filter: 'blur(0px)',
    duration: 0.8,
    ease: 'power3.out',
    delay,
    onComplete: () => {
      el.classList.add('is-visible');
      gsap.set(el, { clearProps: 'opacity,transform,filter,scale,visibility,rotation' });
    }
  });
}

export function initScrollAnimations() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  animatedSet.clear(); // Reset set on re-init

  const scrollytellingWrapper = document.getElementById('scrollytellingWrapper');
  const allElements = document.querySelectorAll<HTMLElement>('[data-animate]');

  const elementsToAnimate: HTMLElement[] = [];

  // 1. Initial Setup Loop (Immediate Anti-Teleport)
  allElements.forEach(el => {
    // Skip if inside scrollytelling (handled by its own script)
    if (scrollytellingWrapper && scrollytellingWrapper.contains(el)) {
      el.style.opacity = '1'; // Ensure visible
      el.classList.add('is-visible');
      return;
    }

    // Determine variant
    const variant = (el.dataset.animate || 'up').trim();
    const fromProps = getInitialState(variant);

    // IMMEDIATELY set initial state
    gsap.set(el, fromProps);
    elementsToAnimate.push(el);
  });

  if (!elementsToAnimate.length) return;

  // 2. Setup Observer (OPTIMIZED MODE)
  // Wait 100ms - enough to stabilize layout but fast enough to feel "instant"
  setTimeout(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;

            // STRICT CHECK: Top of page guard (Preserved but tuned).
            // Only blocks if we are strictly at the top and element is WAY down.
            const rect = el.getBoundingClientRect();
            if (window.scrollY < 50 && rect.top > window.innerHeight) {
              return;
            }

            observer?.unobserve(el);
            playAnimation(el);
          }
        });
      },
      // RootMargin tuned: -5% is enough to avoid "pop-in" but ensures bottom elements trigger.
      { threshold: 0.1, rootMargin: '0px 0px -5% 0px' }
    );

    elementsToAnimate.forEach(el => observer?.observe(el));
  }, 100);
}

export function cleanupAnimations() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  animatedSet.clear();
  gsap.killTweensOf('[data-animate]');
}

export function initSmoothScroll() {
  if (isInitialized) return;
  isInitialized = true;

  document.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const header = document.querySelector('.header');
    const offset = header?.getBoundingClientRect().height || 80;

    window.scrollTo({
      top: (target as HTMLElement).offsetTop - offset,
      behavior: 'smooth'
    });
  });
}
