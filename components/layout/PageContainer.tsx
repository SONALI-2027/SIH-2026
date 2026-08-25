export function PageContainer({ children }: { children: React.ReactNode }) {
  return <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-8 sm:px-8 lg:pb-10 lg:pt-10">{children}</main>;
}
