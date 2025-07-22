"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify"; 

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
              toast.success("Logged in successfully");
            router.push("/");
          } else if (res?.error) {
              toast.error("Invalid credentials");
          }
        });
      } else {
        // about to make an api call
        axios.post("/api/auth/register", data).then((res) => {
         
        if (res.status === 201) {
          toast.success("User registered successfully");
          router.push("/sign-in");
        } else {
          toast.error("Registration failed");
        }
        });
      }
    } catch (error) {
        toast.error("Something went wrong");
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex h-[80vh] justify-center items-center md:w-1/2 w-11/12 mx-auto">
      <div className=" space-y-2 w-full sm:w-1/2 mx-auto flex flex-col items-center  bg-zinc-800  p-5 rounded-md">
        {origin == "signUp" && (
          <input
            {...register("name")}
            type="text"
            placeholder="Your name"
            className=" w-full  px-3 py-1 outline-none"
          />
        )}
        <input
          {...register("email")}
          type="email"
          placeholder="Your email"
          className=" w-full  px-3 py-1 outline-none"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="input your password"
          className=" w-full  px-3 py-1 outline-none"
        />
        <button
          onClick={handleSubmit(onSubmit)}
          className=" w-11/12 bg-zinc-900 p-2 rounded-md cursor-pointer my-2"
        >
          {loading
            ? origin === "signUp"
              ? "Signing up..."
              : "Signing in..."
            : origin === "signUp"
            ? "Sign Up"
            : "Sign In"}
        </button>

        {origin == "signUp" ? (
          <span className=" text-center text-xs">
            Already have an account?{" "}
            <Link
              className=" text-sm font-semibold hover:text-red-300"
              href="/sign-in"
            >
              signIn
            </Link>{" "}
          </span>
        ) : (
          <span className=" text-center text-xs">
            Don't have an account?{" "}
            <Link
              className=" text-sm font-semibold hover:text-red-300"
              href="/sign-up"
            >
              signUp
            </Link>
          </span>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
