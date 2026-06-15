"use client";

import Link from 'next/link';

const styles = {
  base: "inline-flex items-center justify-center rounded-full transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2",
  sizes: {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-3.5 text-base",
  },
  variants: {
    primary: "bg-[#2E6DE7] text-white shadow-lg hover:scale-105",
    secondary: "bg-white text-[#2E6DE7] shadow-sm hover:scale-105",
    ghost: "bg-transparent border border-transparent text-white hover:bg-white/10",
    subtle: "bg-white/8 border border-white/20 text-white",
  }
};

export default function Button({ href, children, variant = 'primary', size = 'lg', onClick, as = 'link', className = '', ...props }) {
  const cls = [styles.base, styles.sizes[size] || styles.sizes.md, styles.variants[variant] || styles.variants.primary, className].join(' ');

  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
