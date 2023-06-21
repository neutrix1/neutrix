import AlertFeedback from "@/components/alerts/Success";
import { loginUser } from "@/utils/auth/loginUser";
import { AlertColor } from "@mui/material";
import axios, { AxiosError } from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";
import { BeatLoader } from "react-spinners";
import Image from "next/image";
import { AlertType, LoginData } from "@/types/types";

const Login = () => {
  // Next router
  const router = useRouter();

  // Button Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Feedback alert
  const [alert, setAlert] = useState<AlertType>({
    open: false,
    condition: undefined,
    message: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Form input data state
  const [login_data, set_login_data] = useState<LoginData>({
    email: "",
    password: "",
    phonenumber: "",
  });

  // Button text state
  const [buttonStatus, setButtonStatus] = useState<string>("Please wait...");

  // Radio form state

  const [loginBy, setLoginBy] = useState<string>("email");

  // Function to update the date in login_data state depending on user input
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const field_name = e.target.name;
    field_name === "email" &&
      set_login_data((prev) => {
        return { ...prev, email: e.target.value, phonenumber: "" };
      });
    field_name === "password" &&
      set_login_data((prev) => {
        return { ...prev, password: e.target.value };
      });
    field_name === "phone" &&
      set_login_data((prev) => {
        return {
          ...prev,
          email: "",
          phonenumber: e.target.value,
        };
      });
  }

  // Submit function that makes API call to the backend service
  async function submitHandler(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setButtonStatus("Logging you in...");
    const response = await axios({
      method: "POST",
      data: login_data,
      url: "/api/auth/login",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        set_login_data({
          email: "",
          password: "",
        });
        if (res.data.statusCode === 40) {
          setAlert({
            open: true,
            condition: "error",
            message: res.data.message,
          });
          setIsLoading(false);
        }
        return res;
      })
      .catch((error) => {
        setIsLoading(false);
        if (error instanceof AxiosError) {
          router.push("/error-500");
        }
        setAlert({
          open: true,
          condition: "error",
          message: "An error occured...please try again",
        });
        return error.response?.data?.error;
      });

    if (response.data.statusCode === 20 && !response.data.verificationStatus) {
      router.push(`/verify/verificationStatus/${response.data.token}`);
    }

    if (response.data.statusCode === 20 && response.data.verificationStatus) {
      setAlert({
        open: true,
        condition: "success",
        message: response.data.message,
      });
      setButtonStatus("Redirecting...");
      const loginRes = await loginUser(
        response.data.email,
        login_data.password
      );
      if (loginRes && loginRes.ok) {
        router.push("/neuclass");
        setIsLoading(false);
      }
    }
  }

  return (
    <>
      <Head>
        <title>Neutrix | Login</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="">
        <div className="rounded-lg lg:w-1/2 mx-auto bg-white rounded-t-lg py-8">
          <div className="w-full py-8 px-4 relative ">
            <div className="relative w-full bg-gray-100 rounded-b-lg pb-12 pt-6 px-4 lg:px-12">
              <Link
                href="/"
                className="absolute right-4 top-4 text-[12px] font-bold underline text-gray-500"
              >
                Go Home
              </Link>
              <div className="mt-4 flex items-center justify-between">
                <span className="border-b w-1/5 lg:w-1/4"></span>
                <p className="text-center text-sm text-gray-400 font-light my-4">
                  {loginBy === "email" && "Sign in with email"}
                  {loginBy === "phone" && "Sign in with phone number"}
                </p>

                <span className="border-b w-1/5 lg:w-1/4"></span>
              </div>
              {alert.open === true && (
                <AlertFeedback
                  open={true}
                  setOpen={() =>
                    setAlert({ open: false, condition: undefined, message: "" })
                  }
                  message={alert.message}
                  status={alert.condition}
                />
              )}
              {/* Check box */}
              <div className="flex gap-[2rem] w-full my-4">
                <div className="flex items-center border-gray-200 rounded dark:border-gray-700">
                  <input
                    defaultChecked
                    id="bordered-radio-1"
                    type="radio"
                    value=""
                    name="bordered-radio"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    onClick={() => setLoginBy("email")}
                  />
                  <label
                    htmlFor="bordered-radio-1"
                    className="w-full py-4 ml-2 text-xs font-medium text-gray-400 dark:text-gray-300"
                  >
                    Email
                  </label>
                </div>
                <div className="flex items-center border-gray-200 rounded dark:border-gray-700">
                  <input
                    id="bordered-radio-2"
                    type="radio"
                    value=""
                    name="bordered-radio"
                    onClick={() => setLoginBy("phone")}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor="bordered-radio-2"
                    className="w-full py-4 ml-2 text-xs font-medium text-gray-400 dark:text-gray-300"
                  >
                    Phone number
                  </label>
                </div>
              </div>

              <form onSubmit={submitHandler}>
                <div className="mt-4 relative">
                  {/* Login with email */}
                  {loginBy === "email" && (
                    <>
                      <div className="absolute left-0 inset-y-0 flex items-center">
                        {" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7 ml-3 text-gray-400 p-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          {" "}
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />{" "}
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />{" "}
                        </svg>{" "}
                      </div>{" "}
                      <input
                        required
                        className="appearance-none placeholder:text-gray-400 border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600  leading-tight"
                        type="email"
                        value={login_data.email}
                        name="email"
                        placeholder="Email"
                        onChange={handleInputChange}
                      />
                    </>
                  )}
                  {/* Login with phone number */}

                  {loginBy === "phone" && (
                    <>
                      <div className="absolute left-0 inset-y-0 flex items-center">
                        <svg
                          aria-hidden="true"
                          focusable="false"
                          className="icon h-6 w-6 ml-3 text-gray-400 p-1"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 512 512"
                          width="1em"
                          height="1em"
                        >
                          <path d="M493.4 24.6l-104-24c-11.3-2.6-22.9 3.3-27.5 13.9l-48 112c-4.2 9.8-1.4 21.3 6.9 28l60.6 49.6c-36 76.7-98.9 140.5-177.2 177.2l-49.6-60.6c-6.8-8.3-18.2-11.1-28-6.9l-112 48C3.9 366.5-2 378.1.6 389.4l24 104C27.1 504.2 36.7 512 48 512c256.1 0 464-207.5 464-464 0-11.2-7.7-20.9-18.6-23.4z" />
                        </svg>
                      </div>
                      <input
                        required
                        className="appearance-none placeholder:text-gray-400 border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600  leading-tight"
                        type="text"
                        value={login_data.phonenumber}
                        name="phone"
                        placeholder="Phone number"
                        onChange={handleInputChange}
                      />
                    </>
                  )}
                </div>
                <div className="mt-4 relative">
                  <div className="absolute inset-y-0 right-3 flex items-center pl-3 z-50">
                    {showPassword ? (
                      <Image
                        src="/icons/hide_eye.png"
                        height={20}
                        width={20}
                        alt="lock"
                        onClick={() => setShowPassword(!showPassword)}
                        className=" cursor-pointer"
                      />
                    ) : (
                      <Image
                        src="/icons/eye.png"
                        height={20}
                        width={20}
                        alt="lock"
                        onClick={() => setShowPassword(!showPassword)}
                        className=" cursor-pointer"
                      />
                    )}
                  </div>
                  <div className="absolute left-0 inset-y-0 flex items-center">
                    {" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7 ml-3 text-gray-400 p-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      {" "}
                      <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />{" "}
                    </svg>{" "}
                  </div>{" "}
                  <input
                    required
                    className="appearance-none placeholder:text-gray-400 border pl-12 border-gray-100 shadow-sm focus:shadow-md focus:placeholder-gray-600  transition  rounded-md w-full py-3 text-gray-600 leading-tight"
                    type={!showPassword ? "password" : "text"}
                    value={login_data.password}
                    name="password"
                    placeholder="Password"
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-end my-4">
                  <button
                    type="button"
                    className="text-xs text-gray-500 border-none"
                    onClick={() => router.push("/passwordRecovery")}
                  >
                    Forget Password?
                  </button>
                </div>
                <div className="mt-8 text-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`bg-gray-700 text-white py-2 px-4 w-full rounded ${
                      isLoading && "cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <BeatLoader size={10} color="#fff" />
                        <span className="text-[15px] font-secondary">
                          {buttonStatus && buttonStatus}
                        </span>
                      </div>
                    ) : (
                      <span>Login</span>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-4 flex justify-center w-full text-center">
                <span className="border-b w-1/5 md:w-1/4"></span>

                <Link
                  href="/register"
                  className="text-xs text-gray-500 underline"
                >
                  Create a new account
                </Link>
                <span className="border-b w-1/5 md:w-1/4"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
