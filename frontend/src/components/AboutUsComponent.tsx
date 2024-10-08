export const AboutUsSection = () => {
  return (
    <div className="flex flex-col p-8 gap-5 md:flex-row bg-[#eaeaea] ">
      <div className=" flex w-full w-1/2">
        <img src="./aboutImage.png" className="rounded-3xl" />
      </div>
      <div className=" flex w-full w-1/2 bg-[#111f36] rounded-2xl flex-col text-white p-4">
        <div>about us</div>
        <span className="flex text-4xl items-center flex-wrap">
          Balance Today, Secure Tomorrow, Thrive Always
        </span>
        <p className="flex mt-10 min-h-[300px] justify-end">
          This is a space to share more about the business: who's behind it,
          what it does and what this site has to offer. It’s an opportunity to
          tell the story behind the business or describe a special service or
          product it offers. You can use this section to share the company
          history or highlight a particular feature that sets it apart from
          competitors.
        </p>
      </div>
    </div>
  );
};
