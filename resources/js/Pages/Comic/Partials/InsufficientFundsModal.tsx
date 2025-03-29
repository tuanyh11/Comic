import ConfirmationModal from '@/Components/UI/ConfirmationModal';
import { FC } from 'react';

interface InsufficientFundsModalProps {
    showFundsModal: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const InsufficientFundsModal: FC<InsufficientFundsModalProps> = ({
    showFundsModal,
    onConfirm,
    onCancel,
}) => {
    return (
        <ConfirmationModal
            isOpen={showFundsModal}
            title="Số dư không đủ"
            message="Số dư trong ví không đủ để mua chương này. Bạn có muốn nạp thêm tiền không?"
            confirmText="Nạp tiền ngay"
            cancelText="Để sau"
            type="warning"
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
};

export default InsufficientFundsModal;
