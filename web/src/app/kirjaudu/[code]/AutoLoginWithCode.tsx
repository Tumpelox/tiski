'use client';

import { autoLoginWithCode } from '@/actions/auth';
import { Heading } from '@/components/Text';
import { useEffect } from 'react';

const AutoLoginWithCode = ({ code }: { code: string }) => {
  const autoLogin = async () => {
    await autoLoginWithCode(code);
  };

  useEffect(() => {
    autoLogin();
  }, [code]);

  return (
    <div className="flex flex-col justify-center items-center grow min-h-[calc(100dvh-var(--spacing)*28)] md:min-h-[calc(100dvh-var(--spacing)*46)] text-background">
      <Heading.h1>Kirjaudutaan sisään koodilla {code}...</Heading.h1>
    </div>
  );
};

export default AutoLoginWithCode;
