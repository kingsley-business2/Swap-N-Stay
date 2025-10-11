// ========================== src/components/UpgradeModal.tsx ==========================
// Removed: import React from 'react';

const UpgradeModal = () => (
  <dialog id="upgrade_modal" className="modal">
    <div className="modal-box">
      <h3 className="font-bold text-lg">Upgrade Required</h3>
      <p className="py-4">This feature is available to premium and gold users only.</p>
      <div className="modal-action">
        <form method="dialog">
          <button className="btn">Close</button>
        </form>
      </div>
    </div>
  </dialog>
);

export default UpgradeModal;
