import { getLoggedInUser } from '@/services/userSession';

const HallintaPage = async () => {
  const { user } = await getLoggedInUser();

  if (!user) {
    return (
      <div>
        <h1>Etusivu</h1>
        <p>Et ole kirjautunut sisään.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Hallinta</h1>
      <p>Tervetuloa {user.name} hallintapaneeliin!</p>
    </div>
  );
};

export default HallintaPage;
