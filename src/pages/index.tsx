import Head from "next/head";
import Link from "next/link";
import { RouterOutputs, api } from "~/utils/api";
import { SignIn, useUser, SignInButton, SignOutButton } from "@clerk/nextjs";

const CreatePostWizard = () => {
  const { user } = useUser();

  console.log(user);

  if (!user) return null;
  return (
    <div className="flex w-full gap-3">
      <img
        src={user.profileImageUrl}
        alt="profile Image"
        className="h-16 w-16 rounded-full"
      />
      <input
        className="grow bg-transparent outline-none"
        placeholder="Type something here"
        type="text"
      />
    </div>
  );
};

// type PostWithUser = RouterOutputs["posts"]["getAll"][number];

// const PostView = (props: PostWithUser) => {
//   const { post, author } = props;
//   return (
//     <div key={post.id} className="gap-3 border-b border-slate-400 p-4">
//       <img
//         src={author?.profilePicture}
//         alt=""
//         className="h-16 w-16 rounded-full"
//       />
//       <div className="flex flex-col">
//         <div className="flex text-slate-300">
//           <span>{`
//             @${author?.username}
//           `}</span>
//         </div>
//         <span>{post.content}</span>
//       </div>
//     </div>
//   );
// };

export default function Home() {
  const user = useUser();

  const { data, isLoading } = api.posts.getAll.useQuery();
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong</div>;
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {!!user.isSignedIn && <CreatePostWizard />}
          </div>
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
          <div className="flex flex-col">
            {[...data, ...data]?.map((post) => (
              <div key={post.id} className="border-slate-4 border-b p-8">
                {post.content}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
