import type { FC } from 'hono/jsx';

export const ToolkitSection: FC = () => {
  const tools = [
    {
      id: '0',
      title: "Water-fed systems",
      desc: "Purified water and reach tools that help deliver a consistent, streak-free finish — especially for higher windows and awkward angles.",
      img: "/api/assets/toolkit/toolkit-img-01.jpg",
      icon: (
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 14c3-6 13-6 16 0"/><path d="M8 14v6M16 14v6"/></svg>
      )
    },
    {
      id: '1',
      title: "Gutter vac + poles",
      desc: "Cleaner gutters without unnecessary risk. Great for properties where ladders are limited or access is tight.",
      img: "/api/assets/toolkit/toolkit-img-02.jpg",
      icon: (
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 20V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12"/><path d="M9 10h6M9 14h6"/></svg>
      )
    },
    {
      id: '2',
      title: "Soft-wash chemistry",
      desc: "Surface-appropriate solutions to lift grime and organic build-up gently, protecting paint and cladding.",
      img: "/api/assets/toolkit/toolkit-img-03.jpg",
      icon: (
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h16"/><path d="M7 7h10M7 17h10"/></svg>
      )
    },
    {
      id: '3',
      title: "Adjustable pressure rigs",
      desc: "The right nozzle, the right mix, the right pressure. Hard cleans where needed, gentle where it matters.",
      img: "/api/assets/toolkit/toolkit-img-04.jpg",
      icon: (
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 19c3-2 5-5 6-9 2 2 4 4 8 4-2 4-6 7-11 5Z"/></svg>
      )
    }
  ];

  return (
    <section id="toolkit" class="py-20">
      <div class="container">
        <div class="section-head mb-12">
          <div class="max-w-2xl">
            <div class="kicker mb-2">Toolkit</div>
            <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Better tools. Better results.</h2>
            <p class="text-muted leading-relaxed">A modern setup means less risk, better consistency, and a finish that lasts.</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 items-stretch" x-data="{ active: '0' }">
          <div class="flex flex-col gap-3 card p-4 reveal border border-white/15 bg-white/5">
            {tools.map((tool, idx) => (
              <button 
                key={tool.id}
                class="group flex items-center justify-between w-full p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-left transition-all aria-selected:bg-white/10 aria-selected:border-accent/40"
                onclick={`
                  document.getElementById('tool-media').style.backgroundImage = 'linear-gradient(180deg, rgba(6,10,18,.10), rgba(6,10,18,.65)), url(${tool.img})';
                  document.getElementById('tool-title').textContent = '${tool.title}';
                  document.getElementById('tool-desc').textContent = '${tool.desc}';
                  document.querySelectorAll('.tool-btn').forEach(b => b.setAttribute('aria-selected', 'false'));
                  this.setAttribute('aria-selected', 'true');
                `}
                aria-selected={idx === 0}
                className="tool-btn group flex items-center justify-between w-full p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-left transition-all aria-selected:bg-white/10 aria-selected:border-accent/40"
              >
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 border border-accent/20 text-accent group-aria-selected:bg-accent/20">
                    {tool.icon}
                  </div>
                  <div>
                    <div class="font-extrabold text-text">{tool.title}</div>
                    <div class="text-xs font-bold text-muted2 mt-0.5">Professional Grade</div>
                  </div>
                </div>
                <svg class="w-5 h-5 text-muted opacity-50 group-aria-selected:opacity-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 6l6 6-6 6"/>
                </svg>
              </button>
            ))}
          </div>

          <div class="card reveal border border-white/15 bg-white/5 overflow-hidden flex flex-col min-h-[360px]">
            <div 
              id="tool-media"
              class="h-64 bg-cover bg-center border-b border-white/10 transition-all duration-500"
              style={{ backgroundImage: `linear-gradient(180deg, rgba(6,10,18,.10), rgba(6,10,18,.65)), url('${tools[0].img}')` }}
            ></div>
            <div class="p-6 bg-white/5 flex-1">
              <h3 id="tool-title" class="text-xl font-extrabold mb-3 tracking-tight">{tools[0].title}</h3>
              <p id="tool-desc" class="text-muted text-sm leading-relaxed">{tools[0].desc}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
