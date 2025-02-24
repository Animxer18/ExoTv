//@ts-nocheck
import React from "react";
import Logo from "@/components/shared/Logo";
import NextLink, { LinkProps } from "next/link";
import { useTranslation } from "next-i18next";

interface FooterItemProps {
  Icon: React.ComponentType<any>;
  href: string;
}

const Footer = () => {
  const { t } = useTranslation("footer");

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 md:px-12 py-16 space-y-4">
      <Logo className="!mb-0" />

      <div className="flex items-center space-x-8 text-center">
        <Link href="/tos">
          <p className="text-lg">{t("term_of_services")}</p>
        </Link>

        <Link href="/dmca">
          <p className="text-lg">{t("dmca")}</p>
        </Link>

        <Link href="/contact">
          <p className="text-lg">{t("contact")}</p>
        </Link>

        <Link href="/deletion-privacy">
          <p className="text-lg">Deletion Privacy</p>
        </Link>
      </div>

      <p className="text-sm text-gray-300 text-center">{t("disclaimer")}</p>

      <p className="text-sm text-gray-300 text-center">© Exoexs</p>
    </div>
  );
};

const Link: React.FC<LinkProps> = (props) => {
  return (
    (<NextLink {...props} className="hover:text-primary-300 transition duration-300">

      {props.children}

    </NextLink>)
  );
};

const ContactItem: React.FC<FooterItemProps> = ({ Icon, href }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Icon className="w-6 h-6 hover:text-primary-500 transition duration-300" />
    </a>
  );
};

export default Footer;
