import type { ReactNode } from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

function Layout({ title, subtitle, children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}

export default Layout;
