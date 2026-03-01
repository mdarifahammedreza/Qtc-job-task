import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {currentYear} QuickHire. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/find-jobs"
              className="text-sm text-gray-600 hover:text-indigo-600"
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              className="text-sm text-gray-600 hover:text-indigo-600"
            >
              Companies
            </Link>
            <Link
              href="/jobs"
              className="text-sm text-gray-600 hover:text-indigo-600"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
