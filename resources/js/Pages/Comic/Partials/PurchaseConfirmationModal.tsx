import ConfirmationModal from '@/Components/UI/ConfirmationModal';
import { Chapter } from '@/types/custom';
import { FC } from 'react';

interface PurchaseConfirmationModalProps {
    showPurchaseModal: boolean;
    selectedChapter: Chapter | null;
    onConfirm: () => void;
    onCancel: () => void;
}

const PurchaseConfirmationModal: FC<PurchaseConfirmationModalProps> = ({
    showPurchaseModal,
    selectedChapter,
    onConfirm,
    onCancel,
}) => {
    return (
        <ConfirmationModal
            isOpen={showPurchaseModal}
            title="Xác nhận mua chương"
            message={`Bạn có muốn mua chương này với giá ${selectedChapter?.pricing || 0} VND không?`}
            confirmText="Mua ngay"
            cancelText="Hủy"
            type="info"
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
};

export default PurchaseConfirmationModal;
