import { FC } from 'react';

interface WalletBalanceProps {
    balance: number;
}

const WalletBalance: FC<WalletBalanceProps> = ({ balance }) => {
    if (balance <= 0) return null;

    return (
        <div className="mt-4 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-100 to-pink-100 p-4">
            <p className="text-sm font-medium">
                Số dư ví:{' '}
                <span className="font-bold text-blue-600">
                    {balance.toLocaleString()} VND
                </span>
            </p>
        </div>
    );
};

export default WalletBalance;
