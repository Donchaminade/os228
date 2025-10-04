"use client";

import { useCallback, useEffect, useRef } from "react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  children: React.ReactNode;
}

export default function InfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  children,
}: InfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [onLoadMore, hasMore, isLoading]
  );

  useEffect(() => {
    if (loadingRef.current) {
      observerRef.current = new IntersectionObserver(handleObserver, {
        threshold: 0.1,
        rootMargin: "100px",
      });
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  return (
    <>
      {children}
      <div ref={loadingRef} className="flex justify-center py-8">
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Chargement de plus de projets...</span>
          </div>
        ) : hasMore ? (
          <div className="text-muted-foreground text-sm">
            Faites défiler pour voir plus de projets
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            Tous les projets ont été chargés
          </div>
        )}
      </div>
    </>
  );
}
