import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Singleton Controller for Lenis Smooth Scroll.
 * Handles lifecycle to prevent conflicts with Astro View Transitions.
 */
export class LenisSystem {
    private static instance: Lenis | null = null;
    private static isInitialized = false;

    /**
     * Initialize Lenis and bind it to GSAP's ticker.
     * CALL THIS on 'astro:page-load'.
     * NOTE: Disabled on mobile/tablet (< 1024px) for better touch scroll performance.
     */
    public static init(): void {
        // Skip Lenis on mobile and tablet - use native scroll
        const isMobileOrTablet = window.innerWidth < 1024;
        if (isMobileOrTablet) {
            console.log('[LenisSystem] Skipped on mobile/tablet. Using native scroll.');
            return;
        }

        if (this.isInitialized || this.instance) {
            console.warn('[LenisSystem] Already initialized. Skipping.');
            return;
        }

        // 1. Create Instance
        this.instance = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Default linear-ish ease
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            // touchMultiplier: 2, // Default
            // infinite: false,
        });

        // 2. Sync with ScrollTrigger
        // Tell ScrollTrigger to update whenever Lenis scrolls
        this.instance.on('scroll', ScrollTrigger.update);

        // 3. Inject into GSAP Ticker
        // This effectively "serves" the Lenis scroll via GSAP's optimized loop
        gsap.ticker.add(this.raf);

        // 4. Enable mild lag smoothing to prevent micro-jitters on frame drops
        // First param: max catchup ms, Second param: min frame time before smoothing kicks in
        gsap.ticker.lagSmoothing(500, 33);

        this.isInitialized = true;
        // Lenis initialized and synced with GSAP
    }

    /**
     * The Request Animation Frame loop function.
     * Bound to the class context to safely pass to GSAP.
     */
    private static raf = (time: number): void => {
        if (LenisSystem.instance) {
            LenisSystem.instance.raf(time * 1000);
        }
    };

    /**
     * Destroy the instance and clean up bindings.
     * CALL THIS on 'astro:before-swap'.
     */
    public static destroy(): void {
        if (!this.instance) return;

        // 1. Remove from GSAP Ticker
        gsap.ticker.remove(this.raf);

        // 2. Destroy Lenis
        this.instance.destroy();

        // 3. Reset State
        this.instance = null;
        this.isInitialized = false;

        // Lenis destroyed for navigation
    }

    /**
     * manually stop/start scrolling (e.g. for modals)
     */
    public static stop() {
        this.instance?.stop();
    }

    public static start() {
        this.instance?.start();
    }
}
