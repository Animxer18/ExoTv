//@ts-nocheck
import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import Section from "@/components/shared/Section";
import { NextPage } from "next";
import { Trans, useTranslation } from "next-i18next";
import Link from "next/link";
import NextErrorComponent, { ErrorProps } from "next/error";

interface CustomErrorProps extends ErrorProps {
  hasGetInitialPropsRun: boolean;
  err?: Error & {
    statusCode: number;
  };
}

// @ts-ignore
const ErrorPage: NextPage<CustomErrorProps, CustomErrorProps> = ({
  statusCode,
  err,
}) => {
  const { t } = useTranslation("_error_page");

  return (
    <div className="relative w-full min-h-screen flex items-center">
      <Head title={`${t("error_title", { statusCode })} - Exoexs`} />

      <div className="fixed z-0 w-full h-full flex items-center justify-center">
        <h1 className="font-bold text-[30vw] text-gray-500">{statusCode}</h1>

        <div className="absolute inset-0 bg-black/90 w-full h-full"></div>
      </div>

      <Section className="relative z-10 flex flex-col items-center w-full h-full text-center ">
        <div className="mb-4 text-gray-300">
          <span className="text-lg">
            <Trans i18nKey="_error_page:error_welcome" statusCode={statusCode}>
              Welcome to the{" "}
              <span className="text-red-300">chiều không gian 404</span>
            </Trans>
          </span>
        </div>

        <p className="text-4xl font-semibold">
          {t("error_heading", { statusCode })}
        </p>

        <p className="text-2xl text-gray-200 mt-4">{t("error_description")}</p>

        <p>
          <i>Error: {err}</i>
        </p>

        <Link href="/">

          <Button primary outline className="mt-8">
            <p className="text-lg">{t("error_goback")}</p>
          </Button>

        </Link>
      </Section>
    </div>
  );
};

// @ts-ignore
ErrorPage.getLayout = (page) => page;

// @ts-ignore
ErrorPage.getInitialProps = async (context) => {
  return await NextErrorComponent.getInitialProps(context);
};

export default ErrorPage;
