"use client";

import Link from 'next/link';

const styles = {
  base: "btn",
  sizes: {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-3.5 text-base",
  },
  variants: {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    subtle: "btn-subtle",
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
