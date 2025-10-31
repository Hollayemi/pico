"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { UserDataProvider } from "../../context/userContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});



const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <title>Progress Intellectual Schools</title>
        <meta name="description" content="Progress Intellectual School is committed to providing a nurturing environment that fosters academic excellence and personal growth. Our curriculum focuses on developing well-rounded individuals who are equipped to make a positive impact on the world." />
        <meta name="keywords" content="School, Progress Intellectual " />
        <meta name="author" content="Progress Intellectual Schools" />
        <meta name="robots" content="index, follow" />

        <link rel="icon" href="/images/progressLogo.png" type="image/x-icon" />

        <meta property="og:title" content=" Progress Intellectual Schools" />
        <meta property="og:description" content="Progress Intellectual School is committed to providing a nurturing environment that fosters academic excellence " />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://progressschools.com" />
        <meta property="og:image" content="https://progressschools.com/images/progressLogo.png" />
        <meta property="og:site_name" content=" Progress Intellectual Schools" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Progress Intellectual Schools" />
        <meta name="twitter:description" content="Progress Intellectual School is committed to providing a nurturing environment that fosters academic excellence " />
        <meta name="twitter:image" content="https://progressschools.com/images/progressLogo.png" />
        <meta name="twitter:site" content="@progressintellectualschool" />
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7203031991825999"
     crossorigin="anonymous"></script>

        <link rel="canonical" href="https://progressschools.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-[1600px] mx-auto !bg-white !text-black`}
      >
        <Toaster />
        <Provider store={store}>
          <UserDataProvider>
            {children}
          </UserDataProvider>
        </Provider>
      </body>
    </html>
  );
}
