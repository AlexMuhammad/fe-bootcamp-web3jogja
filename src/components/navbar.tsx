import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-xl font-bold text-gray-900">Web3 Jogja</h1>
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
