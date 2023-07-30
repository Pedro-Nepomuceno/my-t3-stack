// import Head from "next/head";
// import { type NextPage } from "next";
// import { useUser } from "@clerk/nextjs";
// import { api } from "~/utils/api";
// import { createSSGHelpers } from "@trpc/react/ssg";

// export default function ProfilePage() {
//   const { data, isLoading } = api.profile.getUserByUsername.useQuery({
//     username: "Pedro",
//   });
//   if (isLoading) return <div>...Loading</div>;
//   if (!data) return <div>404</div>;
//   return (
//     <>
//       <Head>
//         <title>Profile</title>
//         <meta name="description" content="Generated by create-t3-app" />
//       </Head>
//       <main className="flex h-screen justify-center">
//         <div>{data.username}</div>
//       </main>
//     </>
//   );
// }
// import { prisma } from "~/server/db";
// import { appRouter } from "~/server/api/root";
// import { Profiler } from "react";


// export const getStaticProps: GetStaticProps = async (contex) => {
//   const {
//     prefetchQuery,
//     prefetchInfiniteQuery,
//     fetchQuery,
//     fetchInfiniteQuery,
//     dehydrate,
//     ssg,
//     queryClient,
//   } = await createSSGHelpers({
//     router: appRouter,
//     ctx: { prisma, userIds: null },
//   });

//   const slug = contex.params?.slug;

//   await ssg.profile.getUserByUsername.prefetch({username: slug});
  
//   return {
//     props: {
//       trpcState: ssg.dehydrate()
//     }
//   }
// };


// export const getStaticPaths =  ()=>{
//   return{paths: ['Pedro'], fallback: "blocking"}
// }

