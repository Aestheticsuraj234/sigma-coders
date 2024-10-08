import { Navbar } from "./navbar";


interface ContentLayoutProps {
  children: React.ReactNode;
}

export function ContentLayout({children}: ContentLayoutProps) {
  return (
    <div>
      <Navbar/>
      <div className="container pt-8 pb-8 px-4 sm:px-8  dark:bg-[#141413] ">{children}</div>
    </div>
  );
}
