import Image from 'next/image';

const Siluet = () => {
  return (
    <div
      className="absolute h-screen top-0 w-full -z-10 left-0"
      style={{
        backgroundImage:
          'linear-gradient(180deg,rgba(144, 174, 200, 1) 0%, rgba(242, 216, 189, 1) 31%, rgba(250, 201, 98, 1) 61%, rgba(246, 208, 140, 1) 79%, rgba(252, 158, 84, 1) 99%)',
      }}
    >
      <Image
        src="/siluetti_demo.png"
        alt="Siluet"
        width={1074}
        height={452}
        className="absolute w-full object-cover left-0 height-auto bottom-0 lg:bottom-[-20%] xl:bottom-[-30%] 2xl:bottom-[-40%]"
        unoptimized={true}
      />
    </div>
  );
};

export default Siluet;
