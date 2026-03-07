'use client';

/**
 * VerseDisplay.js
 * Place at: src/app/ministry/VerseDisplay.js
 *
 * Props:
 *   theme  'dark' (default) — white text, for blue/navy backgrounds
 *          'light'          — dark text, for white/light card backgrounds
 */

const VERSES = [
  { text: 'I can do all things through Christ who strengthens me.', ref: 'Philippians 4:13' },
  { text: 'Trust in the Lord with all your heart, and do not lean on your own understanding.', ref: 'Proverbs 3:5' },
  { text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you.', ref: 'Jeremiah 29:11' },
  { text: 'Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.', ref: 'Joshua 1:9' },
  { text: 'The Lord is my shepherd; I shall not want.', ref: 'Psalm 23:1' },
  { text: 'Come to me, all you who are weary and burdened, and I will give you rest.', ref: 'Matthew 11:28' },
  { text: 'And we know that in all things God works for the good of those who love him.', ref: 'Romans 8:28' },
  { text: 'Delight yourself in the Lord, and he will give you the desires of your heart.', ref: 'Psalm 37:4' },
  { text: 'Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.', ref: 'Philippians 4:6' },
  { text: 'But those who hope in the Lord will renew their strength. They will soar on wings like eagles.', ref: 'Isaiah 40:31' },
  { text: 'The name of the Lord is a fortified tower; the righteous run to it and are safe.', ref: 'Proverbs 18:10' },
  { text: 'Seek first his kingdom and his righteousness, and all these things will be given to you as well.', ref: 'Matthew 6:33' },
  { text: 'I am the way, the truth, and the life. No one comes to the Father except through me.', ref: 'John 14:6' },
  { text: 'God is our refuge and strength, an ever-present help in trouble.', ref: 'Psalm 46:1' },
];

export default function VerseDisplay({ theme = 'dark' }) {
  const now       = new Date();
  const start     = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const verse     = VERSES[dayOfYear % VERSES.length];

  const isDark = theme === 'dark';

  const quoteColor = isDark ? 'rgba(255,255,255,0.2)'  : 'rgba(46,109,231,0.2)';
  const textColor  = isDark ? 'rgba(255,255,255,0.9)'  : '#0F2A4A';
  const refColor   = isDark ? 'rgba(255,255,255,0.55)' : '#2E6DE7';

  return (
    <div className="flex flex-col gap-3">
      <span style={{ fontSize: 48, lineHeight: 0.8, color: quoteColor, fontFamily: 'Georgia, serif', userSelect: 'none' }}>
        &ldquo;
      </span>
      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, lineHeight: 1.75, color: textColor, fontStyle: 'italic' }}>
        {verse.text}
      </p>
      <p style={{ fontSize: 12, fontWeight: 700, color: refColor, letterSpacing: '0.1em' }}>
        — {verse.ref}
      </p>
    </div>
  );
}