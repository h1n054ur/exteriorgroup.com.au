import type { FC } from 'hono/jsx';

export const Reviews: FC = () => {
  const reviews = [
    { text: "“They were on time, super professional, and the windows looked perfect. No streaks, no mess, just a clean finish.”", meta: "— Sarah M. • Residential" },
    { text: "“The driveway and paths came up like new. They explained the approach first and cleaned up everything after.”", meta: "— Daniel K. • Pressure wash" },
    { text: "“Great communication from booking to completion. The building looks brighter and more presentable.”", meta: "— Ayesha R. • Commercial" },
    { text: "“Gutters cleared, no mess left behind, and they sent photos for peace of mind.”", meta: "— Michael T. • Maintenance" }
  ];

  return (
    <section id="reviews" class="py-20">
      <div class="container">
        <div class="section-head mb-12">
          <div class="max-w-2xl">
            <div class="kicker mb-2">Reviews</div>
            <h2 class="text-3xl md:text-4xl font-extrabold mb-4">People notice the difference</h2>
            <p class="text-muted leading-relaxed">High ratings come from consistency: clear comms, safe process, and detail work that doesn’t get skipped.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div class="card p-8 reveal border border-white/15 bg-white/5 flex flex-col justify-between min-h-[220px]">
            <div class="flex justify-between items-start">
              <div>
                <div class="text-5xl font-black tracking-tighter mb-3">4.9</div>
                <div class="flex gap-1.5" aria-label="5 stars">
                  {[1,2,3,4,5].map(() => (
                    <svg class="w-5 h-5 fill-amber-500" viewBox="0 0 24 24"><path d="M12 2l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-7Z"/></svg>
                  ))}
                </div>
              </div>
              <span class="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-muted uppercase tracking-widest">Google-style</span>
            </div>
            <p class="text-muted text-sm leading-relaxed mt-6">Based on consistent feedback from residential and commercial clients across Sydney.</p>
          </div>

          <div class="card p-8 reveal border border-white/15 bg-white/5 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
            <div id="review-container" class="relative z-10 transition-opacity duration-300">
              <p id="review-text" class="text-lg leading-relaxed text-white/90 italic mb-6">
                “They were on time, super professional, and the windows looked perfect. No streaks, no mess, just a clean finish.”
              </p>
              <div class="flex items-center justify-between">
                <div id="review-meta" class="text-xs font-bold text-muted2 uppercase tracking-widest">— Sarah M. • Residential</div>
                
                <div class="flex gap-2">
                  <button class="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" onclick="prevReview()">
                    <svg class="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
                  </button>
                  <button class="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors" onclick="nextReview()">
                    <svg class="w-5 h-5 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `
        const reviews = ${JSON.stringify(reviews)};
        let currentReview = 0;
        const reviewText = document.getElementById('review-text');
        const reviewMeta = document.getElementById('review-meta');
        const container = document.getElementById('review-container');

        function showReview(index) {
          container.style.opacity = '0';
          setTimeout(() => {
            currentReview = (index + reviews.length) % reviews.length;
            reviewText.textContent = reviews[currentReview].text;
            reviewMeta.textContent = reviews[currentReview].meta;
            container.style.opacity = '1';
          }, 300);
        }

        window.nextReview = () => showReview(currentReview + 1);
        window.prevReview = () => showReview(currentReview - 1);
      `}} />
    </section>
  );
};
