import LanguageSwitch from '@/components/LanguageSwitch';
import Siluet from '@/components/Siluet';
import { Heading, Paragraph } from '@/components/Text';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What is this about? - Tarratoimikunta',
  description:
    'A short English introduction to Tarratoimikunta and its stickers at Summer services.',
};

const Page = async () => {
  return (
    <div className="grow bg-primary text-primary-foreground">
      <LanguageSwitch href="/sivut/mista-on-kyse">FI</LanguageSwitch>
      <Siluet height="half" variant="secondary">
        <Heading.h1 className="mt-6 mb-4 text-4xl text-wrap uppercase">
          What’s it all about?
        </Heading.h1>
      </Siluet>
      <div className="flex flex-col gap-4 container max-w-5xl mx-auto pb-8 pt-4 px-4 sm:px-8 md:px-8 lg:px-0 text-lg">
        <Paragraph>
          Tarratoimikunta is a collective rooted in Conservative Laestadianism that advocates for LGBTQ+ and sexual rights. The highlight of the Sticker Committee’s year are the summer services, where we distribute stickers that are kind and gentle but shatter the status quo!

        </Paragraph>
        <Paragraph>
          Some of us in the Sticker Committee have left Conservative Laestadianism, while others still belong to the community and carry the Laestadian faith in their hearts. What unites us all, however, is our concern for the human rights situation within our community. For example, erasing the existence of trans people, preaching that homosexuality is a sin, and harsh teachings on masturbation and contraception do not protect life but instead these practices crush human spirits.
        </Paragraph>
        <Paragraph>
          Jesus was always on the side of the oppressed and the weak. That is why we, too, want to challenge harmful teachings, spark conversation, and make minorities in our community visible. Our goal is to distribute 20,000 stickers at the Kauhava Summer Services in 2026, reminding people of these important topics.
        </Paragraph>
        <Paragraph>
          Our hope is that the stickers will encourage people at summer services to stop and discuss these topics and realize that there is a gentler and more tolerant way to be in faith. The words of Hymn 509 capture the Sticker Committee’s goals well:
        </Paragraph>
        <Paragraph className="pl-6">
          Herra, elämääni<br />
          valvo, etten harhaan<br />
          vaeltaisi täällä<br />
          ohi ihmisten.<br />
        </Paragraph>
        <Paragraph className="pl-6">
          Herra, auta aina,<br />
          etten ketään paina,<br />
          etten toisten taakkaa<br />
          suuremmaksi tee. <br />
        </Paragraph>
        <Paragraph className="pl-6">
          Vierelläni kulje,<br />
          askeleeni ohjaa,<br />
          etten väisty, milloin<br />
          kutsut auttamaan. <br />
        </Paragraph>
        <Paragraph className="pl-6">
          Sydäntäni ohjaa,<br />
          anna minun, Herra,<br />
          armossasi kasvaa,<br />
          olla ihminen.<br />
        </Paragraph>

      </div>
    </div>
  );
};

export default Page;
