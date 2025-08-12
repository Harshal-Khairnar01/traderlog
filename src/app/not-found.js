export default function NotFound() {
  return (
    <div className=" w-full h-screen flex justify-center items-center p-5">
      <div className="text-center  p-8 max-w-2xl mx-auto bg-gray-900 text-white rounded-xl shadow-2xl">
        <h1 className=" text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-red-500 animate-pulse">
          404 - Not Found
        </h1>
        <p className="mt-4 text-xl text-gray-300">
          Looks like you've hit a page that's not on our trading charts.
        </p>
        <p className="mt-2 text-lg text-gray-400">
          Don't worry, let's get you back to a more profitable path.
        </p>
        <div className="mt-10 flex flex-col items-center space-y-4">
          <a href="/" className="text-blue-400 hover:text-blue-300 underline">
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}
