import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import { SignIn, useUser, SignInButton, SignOutButton } from "@clerk/nextjs";
import dayjs from "dayjs";
import { LoadingPage, LoadingSpinner } from "~/components/loading";

import { type NextPage } from "next";

import Image from "next/image";

import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { PageLayout } from "~/components/layout";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      ctx.posts.getAll.invalidate;
    },
  });

  const [input, setInput] = useState("");

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
        value={input}
        disabled={isPosting}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      {input !== "" && !isPosting && (
        <button
          onClick={() => {
            mutate({ content: input });
          }}
          onKeyDown={(e) => {
            if (e.key == "enter") {
              e.preventDefault();
              if (input !== "") {
                mutate({ content: input });
              }
            }
          }}
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />{" "}
        </div>
      )}
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;

  return (
    <div key={post.id} className="gap-3 border-b border-slate-400 p-4">
      <img
        src={author?.profilePicture}
        alt=""
        className="h-16 w-16 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex gap-2 font-bold text-slate-300">
          <Link href={`/@${author?.username}`}>
            <span>{`
            @${author?.username}
          `}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` . ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>

        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();

  if (postLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;
  return (
    <div className="flex flex-col">
      {data?.map((fullpost) => (
        <PostView {...fullpost} key={fullpost.post.id} />
      ))}
    </div>
  );
};

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  return (
    <PageLayout>
      {!isSignedIn && (
        <div className="flex justify-center">
          <SignInButton />
        </div>
      )}
      {!!isSignedIn && <CreatePostWizard />}
      <Feed />
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </PageLayout>
  );
}
