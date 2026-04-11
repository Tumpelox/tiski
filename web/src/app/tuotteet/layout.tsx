const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container max-w-5xl mx-auto px-4 sm:px-8 md:px-8 lg:px-0">
      {children}
    </div>
  );
};

export default Layout;
