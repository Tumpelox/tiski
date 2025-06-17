import { ReCaptchaProvider } from 'next-recaptcha-v3';

const ReCaptchaContext = ({ children }: { children: React.ReactNode }) => {
  return <ReCaptchaProvider>{children}</ReCaptchaProvider>;
};

export default ReCaptchaContext;
