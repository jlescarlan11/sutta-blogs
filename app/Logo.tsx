import Image from "next/image";
import AppLogo from "../public/logo.svg";

const Logo = () => {
  return <Image src={AppLogo} height="40" width="40" alt="Blog It Logo" />;
};

export default Logo;
