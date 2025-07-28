// "use client";

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import Link from "next/link";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { toast } from "react-toastify";

// const LoginForm = ({ origin = "signIn" }) => {
//   const [loading, setLoading] = useState(false);
//   const { register, handleSubmit } = useForm({
//     defaultValues: {
//       email: "",
//       password: "",
//       ...(origin === "signUp" && { name: "" }),
//     },
//   });

//   const router = useRouter();

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       if (origin == "signIn") {
//         signIn("credentials", {
//           ...data,
//           redirect: false,
//         }).then((res) => {
//           if (res?.ok) {
//               toast.success("Logged in successfully");
//             router.push("/");
//           } else if (res?.error) {
//               toast.error("Invalid credentials");
//           }
//         });
//       } else {
//         // about to make an api call
//         axios.post("/api/auth/register", data).then((res) => {

//         if (res.status === 201) {
//           toast.success("User registered successfully");
//           router.push("/sign-in");
//         } else {
//           toast.error("Registration failed");
//         }
//         });
//       }
//     } catch (error) {
//         toast.error("Something went wrong");
//       console.log(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className=" flex h-[80vh] justify-center items-center md:w-1/2 w-11/12 mx-auto">
//       <div className=" space-y-2 w-full sm:w-1/2 mx-auto flex flex-col items-center  bg-zinc-800  p-5 rounded-md">
//         {origin == "signUp" && (
//           <input
//             {...register("name")}
//             type="text"
//             placeholder="Your name"
//             className=" w-full  px-3 py-1 outline-none"
//           />
//         )}
//         <input
//           {...register("email")}
//           type="email"
//           placeholder="Your email"
//           className=" w-full  px-3 py-1 outline-none"
//         />
//         <input
//           {...register("password")}
//           type="password"
//           placeholder="input your password"
//           className=" w-full  px-3 py-1 outline-none"
//         />
//         <button
//           onClick={handleSubmit(onSubmit)}
//           className=" w-11/12 bg-zinc-900 p-2 rounded-md cursor-pointer my-2"
//         >
//           {loading
//             ? origin === "signUp"
//               ? "Signing up..."
//               : "Signing in..."
//             : origin === "signUp"
//             ? "Sign Up"
//             : "Sign In"}
//         </button>

//         {origin == "signUp" ? (
//           <span className=" text-center text-xs">
//             Already have an account?{" "}
//             <Link
//               className=" text-sm font-semibold hover:text-red-300"
//               href="/sign-in"
//             >
//               signIn
//             </Link>{" "}
//           </span>
//         ) : (
//           <span className=" text-center text-xs">
//             Don't have an account?{" "}
//             <Link
//               className=" text-sm font-semibold hover:text-red-300"
//               href="/sign-up"
//             >
//               signUp
//             </Link>
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LoginForm;

'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'
import { ChevronRight, Eye, EyeOff } from 'lucide-react'

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const router = useRouter()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      signIn('credentials', {
        ...data,
        redirect: false,
      }).then((res) => {
        if (res?.ok) {
          toast.success('Logged in successfully')
          router.push('/')
        } else if (res?.error) {
          toast.error('Invalid credentials')
        }
      })
    } catch (error) {
      toast.error('Something went wrong')
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white flex items-center justify-center p-4 font-inter">
      <div className="bg-[#24243E] rounded-3xl shadow-2xl flex flex-col lg:flex-row w-full max-w-6xl overflow-hidden">
        <div className="relative lg:w-1/2 bg-gradient-to-br from-[#4A00B0] to-[#8E2DE2] p-8 flex flex-col justify-between rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 rounded-t-3xl lg:rounded-l-3xl lg:rounded-tr-none"
            style={{
              backgroundImage: 'url("/colorful-logo.svg")', // Using the local SVG
            }}
          ></div>
          <div className="relative z-10 flex justify-between items-start">
            <div className="text-xl font-bold text-white">Powered by AI</div>
            <Link
              href="/sign-up"
              className="flex items-center text-white text-sm px-3 py-1 rounded-full border border-white hover:bg-white hover:text-[#4A00B0] transition-colors"
            >
              Back to Signup <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
        </div>

        <form
          className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-4xl font-bold mb-2">Log in to your account</h1>
          <p className="text-gray-400 mb-8 text-sm">
            Don't have an account?{' '}
            <a href="#" className="text-[#8E2DE2] hover:underline">
              Sign up
            </a>
          </p>

          <input
            {...register('email')}
            type="email"
            placeholder="Email"
            className="bg-[#3A3A5E] text-white p-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#8E2DE2] placeholder-gray-400"
          />
          <div className="relative mb-4">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full bg-[#3A3A5E] text-white p-3 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-[#8E2DE2] placeholder-gray-400"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-6">
            <a href="#" className="text-[#8E2DE2] text-sm hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <button
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-[#8E2DE2] text-white p-3 rounded-xl font-semibold text-lg hover:bg-[#6A0DAD] transition-colors shadow-lg"
          >
            Log in
          </button>

          {/* Or login with */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="mx-4 text-gray-500 text-sm">Or log in with</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 flex items-center justify-center bg-[#3A3A5E] text-white p-3 rounded-xl font-semibold hover:bg-[#4A4A6E] transition-colors shadow-md">
              {/* Google Icon SVG */}
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12.0001 4.75C14.0001 4.75 15.6801 5.45 16.9401 6.64L19.4901 4.1C17.5601 2.25 15.0001 1.25 12.0001 1.25C7.7201 1.25 4.0101 3.64 2.2201 7.02L5.8001 9.87C6.6701 7.18 9.1101 4.75 12.0001 4.75Z"
                  fill="#EA4335"
                />
                <path
                  d="M23.75 12.25C23.75 11.58 23.69 10.96 23.58 10.35H12.0001V14.25H18.7201C18.4301 15.77 17.5101 17.07 16.2001 17.93L19.7801 20.78C21.9001 19.06 23.7501 16.04 23.7501 12.25Z"
                  fill="#4285F4"
                />
                <path
                  d="M5.80005 14.63C5.57005 13.96 5.45005 13.29 5.45005 12.5C5.45005 11.71 5.57005 11.04 5.80005 10.37L2.22005 7.52C1.48005 9.07 1.08005 10.74 1.08005 12.5C1.08005 14.26 1.48005 15.93 2.22005 17.48L5.80005 14.63Z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.0001 22.75C14.9001 22.75 17.3901 21.78 19.2501 20.18L16.2001 17.93C15.2001 18.61 13.7301 19.18 12.0001 19.18C9.1101 19.18 6.6701 16.75 5.8001 14.06L2.2201 16.91C4.0101 20.29 7.7201 22.75 12.0001 22.75Z"
                  fill="#34A853"
                />
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center bg-[#3A3A5E] text-white p-3 rounded-xl font-semibold hover:bg-[#4A4A6E] transition-colors shadow-md">
              {/* Apple Icon SVG */}
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.5 11.08c-.07-2.02 1.39-3.33 2.52-4.08-1.12-1.64-2.82-2.15-4.52-2.19-2.22-.05-4.42 1.25-5.59 1.25-1.18 0-2.65-1.17-4.14-1.11-2.02.08-3.93 1.13-4.93 2.92-.95 1.72-.85 4.19.46 6.09 1.02 1.5 2.56 3.01 4.41 3.06 1.7.05 2.37-1.13 4.14-1.13 1.77 0 2.28 1.13 4.14 1.08 1.85-.05 3.19-1.39 4.21-2.89.94-1.39 1.3-2.65 1.34-2.78-.02-.01-2.73-1.07-2.79-4.22zm-3.5 10.08c.84-.96 1.48-2.13 1.39-3.44-1.21.04-2.66.77-3.54 1.72-.78.84-1.42 2.02-1.34 3.33 1.22-.05 2.67-.77 3.49-1.61z" />
              </svg>
              Apple
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
