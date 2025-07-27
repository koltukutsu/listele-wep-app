import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col justify-center items-center gap-6">
          <div className="flex flex-row justify-between">
            <ul className="flex flex-row gap-4 text-sm">
              <li className="text-gray-600 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-400 cursor-pointer transition-colors">
                <Link href="/faq">SSS</Link>
              </li>
              <li className="text-gray-400 dark:text-gray-600">
                •
              </li>
              <li className="text-gray-600 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-400 cursor-pointer transition-colors">
                <Link href="/kvkk">KVKK</Link>
              </li>
              <li className="text-gray-400 dark:text-gray-600">
                •
              </li>
              <li className="text-gray-600 dark:text-gray-400 hover:text-lime-600 dark:hover:text-lime-400 cursor-pointer transition-colors">
                <Link href="/contact">İletişim</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Listelee.io - Fikirleri hayata geçiren platform
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
