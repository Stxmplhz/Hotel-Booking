import { CheckCircle, AlertCircle } from 'lucide-react';
import Modal from './Modal'; // Import Modal ตัวที่น้องให้มา

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error';
  title?: string;
  message: string;
}

export const StatusModal = ({ isOpen, onClose, type, title, message }: StatusModalProps) => {
  const isSuccess = type === 'success';

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={title || (isSuccess ? "Success" : "Error")}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
          isSuccess ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
        }`}>
          {isSuccess ? (
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400 animate-in zoom-in fill-mode-both duration-500 delay-150" />
          ) : (
            <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400 animate-in shake-in duration-500" />
          )}
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>

        <button 
          onClick={onClose}
          className={`w-full py-2.5 rounded-xl font-semibold text-white transition-all ${
            isSuccess 
              ? 'bg-[#6167c4] hover:bg-[#4f55a8]' 
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {isSuccess ? "Great!" : "Close"}
        </button>
      </div>
    </Modal>
  );
};