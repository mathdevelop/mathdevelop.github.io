// Builds the portfolio into docs/: index.html (English), pt/index.html (Portuguese), and 404.html.
// Usage: node build.js
const fs = require('fs');
const path = require('path');
const { links, en, pt, domain } = require('./content');

const OUT = path.join(__dirname, 'docs');
const SITE = `https://${domain}`;
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const icon = {
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-3.95v-11Z"/></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M8 7h9v9"/></svg>',
};

function page(t) {
  const other = t === en ? pt : en;
  const nav = Object.entries(t.nav)
    .map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`)
    .join('');
  const impact = t.impact.items.map(([n, text]) => `<li><strong>${esc(n)}</strong><span>${esc(text)}</span></li>`).join('');
  const jobs = t.experience.jobs
    .map(
      (j) => `<li class="job">
        <div class="job__meta"><span class="mono">${esc(j.period)}</span><span>${esc(j.place)}</span></div>
        <div class="job__body">
          <h3>${esc(j.role)} <span class="job__company">· ${esc(j.company)}</span></h3>
          <p class="job__context">${esc(j.context)}</p>
          <ul>${j.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        </div>
      </li>`
    )
    .join('');
  const projects = t.projects.items
    .map(
      (p) => `<li class="card">
        <span class="card__tag mono">${esc(p.tag)}</span>
        <h3>${p.link ? `<a href="${esc(p.link)}">${esc(p.name)}</a>` : esc(p.name)}</h3>
        <p>${esc(p.text)}</p>
        ${p.link ? `<span class="card__link" aria-hidden="true">${esc(p.linkLabel)} ${icon.arrow}</span>` : ''}
      </li>`
    )
    .join('');
  const skills = t.skills.groups
    .map(([g, list]) => `<div class="skill"><dt>${esc(g)}</dt><dd>${list.split(', ').map((s) => `<span class="chip">${esc(s)}</span>`).join('')}</dd></div>`)
    .join('');
  const education = t.education.items.map(([d, w]) => `<li><strong>${esc(d)}</strong><span>${esc(w)}</span></li>`).join('');
  const contactLinks = `
    <a class="button" href="mailto:${links.email}">${icon.mail}<span>${esc(links.email)}</span></a>
    <a class="button button--ghost" href="${links.linkedin}">${icon.linkedin}<span>LinkedIn</span></a>
    <a class="button button--ghost" href="${links.github}">${icon.github}<span>GitHub</span></a>`;

  return `<!doctype html>
<html lang="${t.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<link rel="canonical" href="${SITE}${t.path}">
<link rel="alternate" hreflang="en" href="${SITE}/">
<link rel="alternate" hreflang="pt-BR" href="${SITE}/pt/">
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta property="og:type" content="profile">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:url" content="${SITE}${t.path}">
<meta name="theme-color" content="#0f5c6e">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;700&display=swap" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;700&display=swap"></noscript>
<link rel="stylesheet" href="/style.css">
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Matheus Alves da Silva',
    jobTitle: t.hero.role,
    url: SITE,
    sameAs: [links.linkedin, links.github],
  })}</script>
</head>
<body>
<a class="skip-link" href="#main">${t === en ? 'Skip to content' : 'Pular para o conteúdo'}</a>
<header class="topbar">
  <div class="wrap topbar__inner">
    <a class="logo" href="${t.path}"><span class="mono">ma</span><span class="visually-hidden"> · Matheus Alves</span><span class="logo__cursor" aria-hidden="true"></span></a>
    <nav aria-label="${t === en ? 'Sections' : 'Seções'}"><ul class="nav">${nav}</ul></nav>
    <a class="lang" href="${other.path}" hreflang="${other.lang}" lang="${other.lang}">${esc(t.switchLabel)}</a>
  </div>
</header>

<main id="main">
  <section class="hero wrap" aria-labelledby="hero-title">
    <p class="hero__greeting mono">${esc(t.hero.greeting)}</p>
    <h1 id="hero-title">${esc(t.hero.name)}<span class="accent">.</span></h1>
    <p class="hero__role">${esc(t.hero.role)}</p>
    <p class="hero__tagline">${esc(t.hero.tagline)}</p>
    <p class="hero__location mono">${esc(t.hero.location)}</p>
    <div class="hero__cta">
      <a class="button" href="#contact">${esc(t.hero.ctaPrimary)}</a>
      <a class="button button--ghost" href="#experience">${esc(t.hero.ctaSecondary)}</a>
      <a class="icon-link" href="${links.linkedin}" aria-label="LinkedIn">${icon.linkedin}</a>
      <a class="icon-link" href="${links.github}" aria-label="GitHub">${icon.github}</a>
    </div>
  </section>

  <section id="about" class="section wrap" aria-labelledby="about-title">
    <h2 id="about-title"><span class="mono">01</span>${esc(t.about.heading)}</h2>
    <div class="prose">${t.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
  </section>

  <section id="impact" class="section wrap" aria-labelledby="impact-title">
    <h2 id="impact-title"><span class="mono">02</span>${esc(t.impact.heading)}</h2>
    <ul class="stats">${impact}</ul>
  </section>

  <section id="experience" class="section wrap" aria-labelledby="experience-title">
    <h2 id="experience-title"><span class="mono">03</span>${esc(t.experience.heading)}</h2>
    <ol class="timeline">${jobs}</ol>
  </section>

  <section id="projects" class="section wrap" aria-labelledby="projects-title">
    <h2 id="projects-title"><span class="mono">04</span>${esc(t.projects.heading)}</h2>
    <ul class="cards">${projects}</ul>
  </section>

  <section id="skills" class="section wrap" aria-labelledby="skills-title">
    <h2 id="skills-title"><span class="mono">05</span>${esc(t.skills.heading)}</h2>
    <dl class="skills">${skills}</dl>
    <h3 class="education__title">${esc(t.education.heading)}</h3>
    <ul class="education">${education}</ul>
  </section>

  <section id="contact" class="section section--contact wrap" aria-labelledby="contact-title">
    <h2 id="contact-title"><span class="mono">06</span>${esc(t.contact.heading)}</h2>
    <p class="contact__text">${esc(t.contact.text)}</p>
    <div class="contact__links">${contactLinks}</div>
  </section>
</main>

<footer class="footer wrap">
  <p>© ${new Date().getFullYear()} Matheus Alves da Silva · ${esc(t.footer)}</p>
</footer>
</body>
</html>
`;
}

function notFound() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found · Matheus Alves</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
</head>
<body>
<main id="main" class="wrap not-found">
  <p class="mono hero__greeting">404</p>
  <h1>Page not found<span class="accent">.</span></h1>
  <p class="hero__tagline">This page doesn't exist. Página não encontrada.</p>
  <div class="hero__cta"><a class="button" href="/">Home</a><a class="button button--ghost" href="/pt/">Início</a></div>
</main>
</body>
</html>
`;
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'pt'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'static'))) fs.copyFileSync(path.join(__dirname, 'static', f), path.join(OUT, f));
fs.writeFileSync(path.join(OUT, 'index.html'), page(en));
fs.writeFileSync(path.join(OUT, 'pt', 'index.html'), page(pt));
fs.writeFileSync(path.join(OUT, '404.html'), notFound());
fs.writeFileSync(path.join(OUT, 'CNAME'), `${domain}\n`);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
fs.writeFileSync(
  path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${SITE}/</loc></url>
  <url><loc>${SITE}/pt/</loc></url>
  <url><loc>${SITE}/anvil-theme-docs/</loc></url>
</urlset>
`
);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('Built portfolio into docs/');
