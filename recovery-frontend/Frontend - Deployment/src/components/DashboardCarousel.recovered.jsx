import { useState, useEffect, useRef } from "react";

const DASHBOARD_SLIDES = [
  {
    id: 1,
    eyebrow: "Frequently Missed",
    headline: "Calculus Limits",
    value: "4",
    metric: "questions",
    icon: "bx-target-lock",
    iconClass:
      "bg-[linear-gradient(135deg,#ff8b1f_0%,#ff5b1c_100%)] text-white shadow-[0_18px_30px_rgba(249,115,22,0.3)]",
  },
  {
    id: 2,
    eyebrow: "Global Rank",
    headline: "Top 15%",
    value: "#42",
    metric: "overall",
    icon: "bx-trophy",
    iconClass:
      "bg-[linear-gradient(135deg,#4361ee_0%,#3046d3_100%)] text-white shadow-[0_18px_30px_rgba(67,97,238,0.28)]",
  },
];

const DashboardCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % DASHBOARD_SLIDES.length;
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            left: scrollRef.current.clientWidth * nextSlide,
            behavior: "smooth",
          });
        }
        return nextSlide;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleScroll = (e) => {
    if (!scrollRef.current) return;
    const slideWidth = scrollRef.current.clientWidth;
    const scrollPosition = e.target.scrollLeft;
    const newSlideIndex = Math.round(scrollPosition / slideWidth);
    if (newSlideIndex !== currentSlide) {
      setCurrentSlide(newSlideIndex);
    }
  };

  const scrollToSlide = (index) => {
    setCurrentSlide(index);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.clientWidth * index,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative mt-2 overflow-hidden rounded-[30px] border border-slate-200/75 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.12),transparent_34%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-[clamp(1rem,4vw,1.2rem)] py-[clamp(1.05rem,4vw,1.35rem)] shadow-[0_24px_44px_rgba(148,163,184,0.16)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.96)_0%,rgba(2,6,23,0.98)_100%)] dark:shadow-[0_24px_44px_rgba(2,6,23,0.34)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/60 dark:bg-white/10"></div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scrollbar-hide flex snap-x snap-mandatory overflow-x-auto scroll-smooth overscroll-x-contain"
        style={{ width: "100%" }}
      >
        {DASHBOARD_SLIDES.map((slide) => (
          <article key={slide.id} className="w-full shrink-0 snap-start">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 text-left">
                <p className="text-[clamp(0.9rem,2.8vw,0.98rem)] font-semibold tracking-tight text-slate-500 dark:text-slate-400">
                  {slide.eyebrow}
                </p>
                <h3 className="mt-2 text-[clamp(1.8rem,6vw,2.15rem)] font-semibold leading-[1.05] tracking-tight text-slate-950 dark:text-white">
                  {slide.headline}
                </h3>
              </div>
              <div
                className={`flex size-[clamp(3.25rem,11vw,3.75rem)] shrink-0 items-center justify-center rounded-[18px] ${slide.iconClass}`}
              >
                <i className={`bx ${slide.icon} text-[clamp(1.45rem,4.6vw,1.65rem)]`}></i>
              </div>
            </div>
            <div className="mt-6 flex items-end gap-2 text-left">
              <span className="text-[clamp(2.6rem,8vw,3.05rem)] font-semibold leading-none tracking-tight text-slate-950 dark:text-white">
                {slide.value}
              </span>
              <span className="mb-1.5 text-[clamp(0.92rem,2.9vw,1rem)] font-medium text-slate-500 dark:text-slate-400">
                {slide.metric}
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-2">
        {DASHBOARD_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-5 bg-orange-500"
                : "w-1.5 bg-slate-300 dark:bg-slate-600"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default DashboardCarousel;
