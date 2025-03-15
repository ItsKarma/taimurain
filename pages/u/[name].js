import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { FaRegMinusSquare, FaRegPlusSquare, FaBed } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import NoSsr from "../../components/NoSsr";
import UserCard from "../../components/userCard";
import Posts from "../../components/posts";
import CreatePost from "../../components/createPost";

export default function Page() {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [userName, setUserName] = useState("");

  async function getPosts() {
    try {
      const response = await fetch("/api/posts", {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPostData(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getUsers(userName) {
    console.log("userName", userName);
    try {
      const response = await fetch(
        `/api/users/${encodeURIComponent(userName)}`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserData(data);
      console.log("userData", data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        if (router.query.name) {
          console.log(router.query.name);
          // await getUsers(router.query.name);
          setUserName(router.query.name);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPageData();
  }, [router.query.name]);

  return (
    <div>
      <Head>
        <title>Circles</title>
        <link rel="icon" href="/favicon.ico" />
        {/* to prevent Firefox FOUC, this must be here */}
        <Script>0</Script>
      </Head>
      <main>
        {/* Toaster - Keep at top */}
        <NoSsr>
          <Toaster position="top-right" />
        </NoSsr>
        <section className="flex mx-4 my-4">
          <UserCard userName={userName} />
          <div className="flex flex-col flex-grow mx-4">
            <CreatePost userId={userData.id} getPosts={getPosts} />
            <Posts userName={userName} />
          </div>
          <UserCard userName={userName} />
        </section>
      </main>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}
