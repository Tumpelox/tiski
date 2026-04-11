import Image from 'next/image';

const Siluet = () => {
  return (
    <div className="absolute h-screen top-0 w-full -z-10 left-0 gradient">
      <Image
        src="/siluetti.webp"
        alt="Siluet"
        width={3760}
        height={652}
        className="absolute object-cover object-left left-0 height-auto min-h-1/4 bottom-0"
        unoptimized={true}
      />
    </div>
  );
};

export default Siluet;
