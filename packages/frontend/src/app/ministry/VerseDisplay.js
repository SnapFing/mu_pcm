
'use client';

const PASSAGES = [
  // Bible verses
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
  { text: 'The heart of man plans his way, but the Lord establishes his steps.', ref: 'Proverbs 16:9' },
  { text: 'If any of you lacks wisdom, let him ask God, who gives generously to all without reproach.', ref: 'James 1:5' },
  { text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish.', ref: 'John 3:16' },
  { text: 'Whatever you do, work heartily, as for the Lord and not for men.', ref: 'Colossians 3:23' },
  { text: 'No weapon formed against you shall prosper.', ref: 'Isaiah 54:17' },
  { text: 'The Lord bless you and keep you; the Lord make his face shine on you and be gracious to you.', ref: 'Numbers 6:24-25' },

  // EGW quotes
  { text: 'The greatest want of the world is the want of men — men who will not be bought or sold, men who in their inmost souls are true and honest.', ref: 'Education, p. 57 — E.G. White' },
  { text: 'Christ is waiting with longing desire for the manifestation of Himself in His church. When the character of Christ shall be perfectly reproduced in His people, then He will come to claim them as His own.', ref: 'Christ\'s Object Lessons, p. 69 — E.G. White' },
  { text: 'True education means more than the pursual of a certain course of study. It means more than a preparation for the life that now is. It has to do with the whole being, and with the whole period of existence possible to man.', ref: 'Education, p. 13 — E.G. White' },
  { text: 'Every morning consecrate yourself to God for that day. Make no calculation for a long life.', ref: 'Steps to Christ, p. 70 — E.G. White' },
  { text: 'Prayer is the breath of the soul. It is the secret of spiritual power.', ref: 'Gospel Workers, p. 254 — E.G. White' },
  { text: 'In the word of God the mind finds themes for the deepest thought, the loftiest aspiration.', ref: 'Steps to Christ, p. 90 — E.G. White' },
  { text: 'We can never be saved in indolence and inactivity. There is no such thing as a truly converted person living a helpless, useless life.', ref: 'Christ\'s Object Lessons, p. 280 — E.G. White' },
  { text: 'The surrender of all our powers to God greatly simplifies the problem of life. It weakens and cuts short a thousand struggles with the passions of the natural heart.', ref: 'The Ministry of Healing, p. 130 — E.G. White' },
  { text: 'God desires that we reach the standard of perfection made possible for us by the gift of Christ.', ref: 'The Acts of the Apostles, p. 531 — E.G. White' },
  { text: 'The Bible is the most ancient and the most comprehensive history that men possess.', ref: 'Education, p. 173 — E.G. White' },
];

export default function VerseDisplay({ theme = 'dark' }) {
  // Rotate daily — same passage all day, new one each day
  const now       = new Date();
  const start     = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const passage   = PASSAGES[dayOfYear % PASSAGES.length];

  const isDark     = theme === 'dark';
  const quoteColor = isDark ? 'rgba(255,255,255,0.2)'  : 'rgba(46,109,231,0.2)';
  const textColor  = isDark ? 'rgba(255,255,255,0.9)'  : '#0F2A4A';
  const refColor   = isDark ? 'rgba(255,255,255,0.55)' : '#2E6DE7';

  return (
    <div className="flex flex-col gap-3">
      <span style={{ fontSize: 48, lineHeight: 0.8, color: quoteColor, fontFamily: 'Georgia, serif', userSelect: 'none' }}>
        &ldquo;
      </span>
      <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 15, lineHeight: 1.75, color: textColor, fontStyle: 'italic' }}>
        {passage.text}
      </p>
      <p style={{ fontSize: 12, fontWeight: 700, color: refColor, letterSpacing: '0.1em' }}>
        — {passage.ref}
      </p>
    </div>
  );
}
