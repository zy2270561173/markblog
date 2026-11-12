<template>
  <div class="notebook-doodle">
    <svg
      viewBox="0 0 460 390"
      fill="none"
      role="img"
      aria-labelledby="doodle-title doodle-desc"
    >
      <title id="doodle-title">摊开的笔记本与铅笔</title>
      <desc id="doodle-desc">手绘的笔记本、铅笔、便签和一条红色批注，纸边有交叉排线阴影。</desc>

      <defs>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="var(--color-pencil)" stroke-width="0.8" opacity="0.22" />
        </pattern>
        <pattern id="hatch-soft" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="9" stroke="var(--color-pencil)" stroke-width="0.7" opacity="0.13" />
        </pattern>
      </defs>

      <circle cx="381" cy="68" r="28" stroke="var(--color-vermilion)" stroke-width="1.5" stroke-dasharray="4 6" opacity="0.55" />
      <path d="M365 69c10-5 21-4 31 0" stroke="var(--color-vermilion)" stroke-width="1.5" stroke-linecap="round" opacity="0.45" />

      <path d="M68 118c93-24 236-25 339-2l-5 191c-95 25-238 24-330-2l-4-187Z" fill="url(#hatch)" opacity="0.55" transform="translate(9 16)" />
      <path d="M47 102c95-24 245-24 354 1l-3 208c-103 26-247 24-346-2l-5-207Z" fill="var(--color-paper-light)" stroke="var(--color-pencil)" stroke-width="2.1" stroke-linejoin="round" />
      <path d="M232 101c4 70 4 139-1 210" stroke="var(--color-pencil)" stroke-width="1.8" />

      <path d="M55 111c56-13 121-17 176-10l-2 195c-57 13-115 13-171 1l-3-186Z" fill="var(--color-paper)" stroke="var(--color-pencil)" stroke-width="1.5" />
      <path d="M239 101c57-7 113-2 157 10l-2 187c-52 12-103 12-154 2l-1-199Z" fill="var(--color-paper)" stroke="var(--color-pencil)" stroke-width="1.5" />

      <g stroke="var(--color-pencil)" stroke-width="1.15" stroke-linecap="round" opacity="0.38">
        <path d="M74 144c42-7 85-8 126-3" />
        <path d="M75 166c38-4 79-4 124 0" />
        <path d="M74 188c29-4 60-3 91 1" />
        <path d="M75 246c33-4 70-4 112 1" />
        <path d="M75 269c41-5 77-4 115 0" />
        <path d="M270 143c35-4 68-4 99-1" />
        <path d="M269 166c29-2 60-2 93 0" />
        <path d="M269 189c41-3 74-2 104 1" />
        <path d="M270 284c28-3 63-2 99 1" />
      </g>

      <g stroke="var(--color-pencil)" stroke-width="2" stroke-linecap="round" fill="none">
        <path d="M193 97c15-18 30-15 31 1 1 14-16 19-28 8" />
        <path d="M199 127c14-16 28-13 29 2 1 12-15 17-27 7" />
        <path d="M195 158c13-14 27-12 28 2 0 11-14 15-25 6" />
      </g>

      <g transform="rotate(-7 318 198)">
        <path d="M292 151h94l-4 70c-31 7-60 7-88 0l-2-70Z" fill="var(--color-amber)" opacity="0.18" stroke="var(--color-pencil)" stroke-width="1.5" />
        <path d="M306 169c18-3 37-3 57 0M306 185c20-3 40-2 60 1M306 201c14-2 28-2 42 0" stroke="var(--color-pencil)" stroke-width="1.3" stroke-linecap="round" opacity="0.7" />
        <path d="M347 146c6-8 14-8 18-2" stroke="var(--color-vermilion)" stroke-width="1.5" stroke-linecap="round" />
      </g>

      <g transform="rotate(12 120 284)">
        <circle cx="115" cy="282" r="25" stroke="var(--color-lake-blue)" stroke-width="1.7" opacity="0.5" />
        <path d="M99 275c9 7 20 12 32 13M103 293c8-9 16-15 26-19" stroke="var(--color-lake-blue)" stroke-width="1.1" stroke-linecap="round" opacity="0.35" />
      </g>

      <g transform="rotate(-22 330 300)">
        <path d="M236 320 374 254l7 15-136 68-16-5 7-12Z" fill="var(--color-paper-light)" stroke="var(--color-pencil)" stroke-width="1.7" stroke-linejoin="round" />
        <path d="m236 320 7-12 12 3-16 18-3-9Z" fill="var(--color-ink-soft)" stroke="var(--color-pencil)" stroke-width="1.4" stroke-linejoin="round" />
        <path d="m253 311 7 14" stroke="var(--color-pencil)" stroke-width="1.5" />
        <path d="M373 255c8-4 16-1 18 6 2 6-2 11-10 8" fill="var(--color-vermilion)" stroke="var(--color-pencil)" stroke-width="1.5" />
        <path d="m267 314 96-45" stroke="var(--color-pencil)" stroke-width="1.1" opacity="0.4" />
      </g>

      <path d="M62 337c31 7 64 7 96-1" stroke="var(--color-pencil)" stroke-width="1.5" stroke-linecap="round" opacity="0.35" stroke-dasharray="4 7" />

      <g class="annotation" transform="rotate(-3 92 54)">
        <path d="M49 30h73" stroke="var(--color-vermilion)" stroke-width="1.2" stroke-dasharray="3 5" opacity="0.6" />
        <text x="49" y="23" fill="var(--color-vermilion)">先写第一行</text>
      </g>
      <path d="M147 65c21 16 26 36 12 58" stroke="var(--color-vermilion)" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.65" />
      <path d="m154 116 5 8 4-9" stroke="var(--color-vermilion)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.65" />

      <g opacity="0.65">
        <path d="m409 313 3 9 9 3-9 4-3 9-4-9-9-4 9-3 4-9Z" stroke="var(--color-amber)" stroke-width="1.2" fill="none" />
        <path d="M38 209c8 2 13 8 14 16" stroke="var(--color-pencil)" stroke-width="1.2" stroke-linecap="round" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.notebook-doodle {
  width: 100%;
  transform: rotate(0.7deg);
}

.notebook-doodle svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.annotation text {
  font-family: var(--font-hand);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

@media (max-width: 900px) {
  .notebook-doodle {
    max-width: 500px;
    margin-inline: auto;
  }
}
</style>
