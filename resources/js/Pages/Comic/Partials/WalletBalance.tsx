import { Wallet } from 'lucide-react';
import { FC } from 'react';

interface WalletBalanceProps {
    balance: number;
}

const WalletBalance: FC<WalletBalanceProps> = ({ balance }) => {
    if (balance <= 0) return null;

    return (
        <div className="mt-6 rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-100/70 to-fuchsia-100/70 p-4 shadow-md">
            <div className="flex items-center gap-3">
                <Wallet className="h-6 w-6 text-indigo-600" />
                <div>
                    <p className="text-sm text-gray-600">Số dư ví:</p>
                    <p className="text-xl font-bold text-indigo-700">
                        {balance.toLocaleString()}{' '}
                        <span className="text-sm font-medium">VND</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WalletBalance;
