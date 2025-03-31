import useOutsideClick from '@/hooks/useOutsideClick';
import { Link } from '@inertiajs/react';
import { HandCoins, PlusCircle, Wallet } from 'lucide-react';
import { useRef, useState } from 'react';

interface WalletDropdownProps {
    wallet: {
        balance: number | string;
        currency: string;
    };
}

const WalletDropdown = ({ wallet }: WalletDropdownProps) => {
    const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
    const walletDropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Use the custom hook to handle outside clicks
    useOutsideClick(walletDropdownRef, () => {
        if (isWalletDropdownOpen) setIsWalletDropdownOpen(false);
    }, [buttonRef]);

    return (
        <div className="relative hidden sm:block" ref={walletDropdownRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                className="flex items-center space-x-1 rounded-full border border-pink-200 bg-white/90 px-3 py-1.5 text-sm transition-colors hover:bg-white"
            >
                <HandCoins className="h-4 w-4 text-pink-500" />
                <span className="font-medium">
                    {wallet?.balance || '0.00'} {wallet.currency}
                </span>
            </button>

            {isWalletDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border bg-white shadow-lg">
                    <div className="p-3">
                        <div className="mb-2 text-center">
                            <p className="text-sm text-gray-600">
                                Số dư của bạn
                            </p>
                            <p className="text-xl font-bold text-pink-600">
                                {wallet?.balance || '0'} {wallet.currency}
                            </p>
                        </div>
                        <Link
                            href={route('wallet.add-funds')}
                            className="flex w-full items-center justify-center rounded-md bg-gradient-to-r from-blue-500 to-pink-500 py-2 text-sm font-medium text-white transition-colors hover:from-blue-600 hover:to-pink-600"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" /> Nạp tiền
                        </Link>
                        <div className="mt-2">
                            <Link
                                href={route('wallet.index')}
                                className="flex w-full items-center justify-center rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                <Wallet className="mr-2 h-4 w-4" /> Quản lý ví
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WalletDropdown;
