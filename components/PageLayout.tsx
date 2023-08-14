export interface LayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen max-w-screen bg-[#0E1525] text-white">
      {children}
    </div>
  );
};

export default PageLayout;
