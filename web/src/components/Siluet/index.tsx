import Image from 'next/image';

const Siluet = () => {
  return (
    <div className="absolute h-screen top-0 w-full -z-10 left-0 gradient">
      <Image
        src="/siluetti_demo.png"
        alt="Siluet"
        width={1074}
        height={452}
        className="absolute w-full object-cover left-0 height-auto bottom-0 xl:hidden"
        unoptimized={true}
      />
    </div>
  );
};

export default Siluet;
