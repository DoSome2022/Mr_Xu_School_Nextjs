"use client";


import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
    <div>
      <Link href="/stafflogin" > 
      職員登入
      </Link>
    </div>

    <div>
      <Link href="/login" > 
      登入
      </Link>
    </div>



    </>
  );
}
