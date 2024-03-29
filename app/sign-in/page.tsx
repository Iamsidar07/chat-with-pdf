import { SignIn } from "@clerk/nextjs";

const page = () => {
  return (
    <SignIn
      afterSignInUrl={"/auth-callback?origin=dashboard"}
      afterSignUpUrl={"/auth-callback?origin=dashboard"}
    />
  );
};
export default page;

