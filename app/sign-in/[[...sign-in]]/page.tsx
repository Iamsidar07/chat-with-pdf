import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { SignIn } from "@clerk/nextjs";

const page = () => {
  return (
    <div className="p-2  w-full pt-12 md:pt-24">
      <MaxWidthWrapper className=" h-full grid place-content-center">
        <SignIn />
      </MaxWidthWrapper>
    </div>
  );
};
export default page;
