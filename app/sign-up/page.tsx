import { SignUp } from "@clerk/nextjs";

const page = () => {
  return (
    <SignUp
      afterSignInUrl={"/auth-callback?origin=dashboard"}
      afterSignUpUrl={"/auth-callback?origin=dashboard"}
    />
  );
};
export default page;

