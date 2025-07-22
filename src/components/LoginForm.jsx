"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";

const LoginForm = ({ origin = "signIn" }) => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      ...(origin === "signUp" && { name: "" }),
    },
  });

  const router = useRouter();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (origin == "signIn") {
        signIn("credentials", {
          ...data,
          redirect: false,
        }).then((res) => {
          if (res?.ok) {
            console.log("Logged in successfully");
            router.refresh();
          } else if (res?.error) {
            console.error("Something went wrong:", res.error);
          }
        });
      } else {
        // about to make an api call
        axios.post("/api/auth/register", data).then((res) => {
          if (res.status === 201) {
            console.log("User registered successfully");
            router.push("/sign-in");
          }
        });
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex h-[80vh] justify-center items-center">
      <div className=" space-y-2 w-full sm:w-1/2 mx-auto flex flex-col items-center bg-black/40  p-5 rounded-md">
        {origin == "signUp" && (
          <input
            {...register("name")}
            type="text"
            placeholder="Your name"
            className=" w-full"
          />
        )}
        <input {...register("email")} type="email" placeholder="Your email" className=" w-full" />
        <input
          {...register("password")}
          type="password"
          placeholder="input your password"
          className=" w-full"
        />
        <button onClick={handleSubmit(onSubmit)} className=" w-full">
          {loading
            ? origin === "signUp"
              ? "Signing up..."
              : "Signing in..."
            : origin === "signUp"
            ? "Sign Up"
            : "Sign In"}
        </button>

        {origin == "signUp" ? (
          <span className=" text-center">
            Already have an account?{" "}
            <Link className=" font-semibold" href="/sign-in">
              signIn
            </Link>{" "}
          </span>
        ) : (
          <span className=" text-center">
            Don't have an account?{" "}
            <Link className=" font-semibold" href="/sign-up">
              signUp
            </Link>
          </span>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
