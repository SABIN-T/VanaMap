import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const SwipeNavigator = () => {
    const navigate = useNavigate();

    // Use Refs to maintain mutable state without triggering re-renders or stale closures in listeners
    const touchStartX = useRef<number | null>(null);
    const touchStartY = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const touchEndY = useRef<number | null>(null);

    // Navigation Order (Matches MobileTabBar)
    // Navigation Order (Matches MobileTabBar)
    const tabs = ['/', '/nearby', '/shops', '/leaderboard', '/heaven', '/cart'];
    const minSwipeDistance = 70; // px

    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => {
            if (window.location.pathname === '/pot-designer') return;
            touchEndX.current = null;
            touchEndY.current = null;
            touchStartX.current = e.targetTouches[0].clientX;
            touchStartY.current = e.targetTouches[0].clientY;
        };

        const handleTouchMove = (e: TouchEvent) => {
            touchEndX.current = e.targetTouches[0].clientX;
            touchEndY.current = e.targetTouches[0].clientY;
        };

        const handleTouchEnd = (e: TouchEvent) => {
            if (touchStartX.current === null || touchEndX.current === null) return;

            const startX = touchStartX.current;
            const endX = touchEndX.current;
            const startY = touchStartY.current || 0;
            const endY = touchEndY.current || 0;

            const distanceX = startX - endX;
            const distanceY = startY - endY;

            // 1. Dominant Axis Check (Must be horizontal swipe)
            if (Math.abs(distanceY) > Math.abs(distanceX)) return;

            // 2. Minimum Distance Check
            if (Math.abs(distanceX) < minSwipeDistance) return;

            // 3. Conflict Check (Leaflet Map or No-Swipe zones)
            const target = e.target as HTMLElement;
            if (target.closest('.leaflet-container')) return;
            if (target.closest('.no-swipe')) return;
            // Also ignore sliders if we had them (e.g. .overflow-x-scroll)
            // Ideally check if target is scrollable horizontally? 
            // For now, strict Map check is critical.

            const isLeftSwipe = distanceX > 0; // Swipe Left -> Next
            const isRightSwipe = distanceX < 0; // Swipe Right -> Prev

            // Get current path (use latest location from closure if this effect re-runs, 
            // OR use a generic look up if the effect is mounted once. 
            // Location changes re-run this effect, so `location.pathname` is fresh.)

            // Wait, if I bind once, `location.pathname` is stale.
            // I should emit a custom event or navigate based on valid stable check?
            // Actually, if I include `location.pathname` in dependency, it re-binds.
            // Re-binding on route change (navigation) is perfectly fine.

            // We need to find the index *inside* the event handler, using fresh location?
            // Since this effect depends on location.pathname, the closure *will* have the fresh pathname.

            const currentPath = window.location.pathname; // Always fresh
            const currentIndex = tabs.findIndex(path => path === currentPath);

            if (currentIndex === -1) return;

            if (isLeftSwipe) {
                if (currentIndex < tabs.length - 1) {
                    navigate(tabs[currentIndex + 1]);
                }
            } else if (isRightSwipe) {
                if (currentIndex > 0) {
                    navigate(tabs[currentIndex - 1]);
                }
            }
        };

        // Attach listeners
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [navigate]); // navigate is stable. location.pathname is handled by window.location check.

    return null;
};
