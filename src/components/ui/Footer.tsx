import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-3 border-t border-gray-400 dark:border-slate-600">
        <div className="text-center">
          <p className="text-xs text-gray-600 dark:text-neutral-400 text-center">
            Developed By{" "}
            <Link className="font-bold italic" href="https://github.com/sakibmukter95">Sakib Mukter</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
