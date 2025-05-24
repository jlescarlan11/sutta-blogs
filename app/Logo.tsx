import { Mansalva } from "next/font/google";

const mansalva = Mansalva({ subsets: ["latin"], weight: "400" });

const Logo = () => {
  return <span className={`${mansalva.className} text-4xl mr-2`}>B</span>;
};

export default Logo;
