import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { LanguageContext } from '@/components/languages/LanguageProvider';

interface MessageDialogProps {
  message: string;
  onClose: () => void;
  type?: 'error' | 'success';
}

export const MessageDialog = ({ message, onClose, type = 'error' }: MessageDialogProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const { localize } = useContext(LanguageContext);

  useEffect(() => {
    setIsVisible(true);
  }, [message]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl mt-32">
        <div className="mb-6 text-black">
          {message}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            {localize("message_dialog_confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}; 