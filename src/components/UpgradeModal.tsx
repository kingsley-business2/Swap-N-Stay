import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UpgradeModalProps {
    isVisible: boolean;
    onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isVisible, onClose }) => {
  const navigate = useNavigate();

  if (!isVisible) return null;

  return (
    // Overlay backdrop
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
        onClick={onClose}
    >
      {/* Modal Content */}
      <div 
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all border-t-4 border-red-500"
        onClick={(e) => e.stopPropagation()} // Prevent closing on internal click
      >
        <h3 className="font-bold text-2xl text-red-700 mb-3">Upgrade Required</h3>
        <p className="text-gray-600 mb-4">
            This feature is restricted to **Premium** and **Gold** tier users. Unlock it now to gain full access.
        </p>
        
        {/* Admin Contact Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm border border-blue-200">
            <p className="font-semibold text-blue-800 mb-2">Need help with your subscription?</p>
            <p>
              <span className="font-medium">Email:</span> 
              <a href="mailto:knsley@gmail.com" className="link link-hover text-blue-600 ml-1">knsley@gmail.com</a>
            </p>
            <p>
              <span className="font-medium">Phone:</span> 
              <a href="tel:+233243266618" className="link link-hover text-blue-600 ml-1">+233 24 326 6618</a>
            </p>
        </div>
        
        <div className="modal-action mt-6 flex justify-between gap-3">
            <button className="btn btn-sm text-gray-600 bg-gray-200 hover:bg-gray-300" onClick={onClose}>
                Close
            </button>
            <button 
                className="btn btn-warning btn-sm px-6 text-white"
                onClick={() => {
                    onClose();
                    navigate('/upgrade'); // Navigate to the upgrade page
                }}
            >
                View Plans
            </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;

