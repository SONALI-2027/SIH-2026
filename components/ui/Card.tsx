export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) { return <section className={`clay rounded-3xl p-5 sm:p-7 ${className}`}>{children}</section>; }
