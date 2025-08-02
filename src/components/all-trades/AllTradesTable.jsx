'use client'

import React from 'react'
import TradeDetailModal from './TradeDetailModal'
import ConfirmationModal from './ConfirmationModal'
import TradesTableBody from '@/components/tables/TradesTableBody'
import { useTradeDetailModal } from '@/hooks/useTradeDetailModal'
import { useConfirmationModal } from '@/hooks/useConfirmationModal'

const tableHeaders = [
  'Date',
  'Symbol',
  'Type',
  'Direction',
  'Qty',
  'Entry/Exit',
  'P/L (%)',
  'Charges',
  'Risk/Reward',
  'Strategy',
  'Outcome',
  'Details',
  'Actions',
]

export default function AllTradesTable({
  groupedTrades,
  onDeleteTrade,
  onEditTrade,
}) {
  const {
    isModalOpen,
    modalContent,
    isSimpleTextModal,
    openDetailedModal,
    openTruncatedContentModal,
    closeModal,
  } = useTradeDetailModal()

  const {
    isConfirmModalOpen,
    itemToDelete,
    openConfirmation,
    confirmAction,
    cancelAction,
  } = useConfirmationModal(onDeleteTrade)

  const handleEditClick = (trade) => {
    onEditTrade(trade)
  }

  return (
    <div className="bg-zinc-900 p-4 rounded-lg shadow-inner ">
      {Object.keys(groupedTrades).length > 0 ? (
        <div className="max-h-[85vh] overflow-y-auto overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-zinc-700">
            <thead className="bg-zinc-700 sticky top-0 z-10">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <TradesTableBody
              groupedTrades={groupedTrades}
              openDetailedModal={openDetailedModal}
              openTruncatedContentModal={openTruncatedContentModal}
              handleEditClick={handleEditClick}
              handleDeleteClick={openConfirmation}
            />
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-center py-4">
          No trade history available.
        </p>
      )}

      <TradeDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isSimpleTextModal ? modalContent?.title : 'Trade Details'}
        content={isSimpleTextModal ? modalContent?.content : null}
        tradeData={isSimpleTextModal ? null : modalContent}
        isSimpleText={isSimpleTextModal}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={cancelAction}
        onConfirm={confirmAction}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the trade for ${
          itemToDelete?.name || 'this instrument'
        }? This action cannot be undone.`}
      />
    </div>
  )
}
