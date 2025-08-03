'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import AllTradesTable from '@/components/all-trades/AllTradesTable'
import NewTradeEntryForm from '@/components/new-trade-entry-form/NewTradeEntryForm'
import Loader from '../Loader'
import {
  fetchTrades,
  addTrade,
  updateTrade,
  deleteTrade,
} from '@/store/tradesSlice'

export default function AllTradesClientPage() {
  const dispatch = useDispatch()

  const { tradeHistory, loading, error } = useSelector((state) => state.trades)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [tradeToEdit, setTradeToEdit] = useState(null)

  useEffect(() => {
    dispatch(fetchTrades())
  }, [dispatch])

  const openAddTradeForm = () => {
    setTradeToEdit(null)
    setIsFormModalOpen(true)
  }

  const openEditTradeForm = useCallback((trade) => {
    setTradeToEdit(trade)
    setIsFormModalOpen(true)
  }, [])

  const closeFormModal = () => {
    setIsFormModalOpen(false)
    setTradeToEdit(null)
    dispatch(fetchTrades())
  }

  const handleAddTrade = async (trade) => {
    await dispatch(addTrade(trade))
    closeFormModal()
  }

  const handleUpdateTrade = async (tradeId, payload) => {
    await dispatch(updateTrade({ tradeId, payload }))
    closeFormModal()
  }

  const handleDeleteTrade = async (id) => {
    await dispatch(deleteTrade(id))
  }

  const allTrades = [...tradeHistory].sort((a, b) => {
    const parseDateTime = (trade) => {
      const datePart = new Date(trade.date).toISOString().split('T')[0]
      const timePart = trade.time.padStart(5, '0')
      return new Date(`${datePart}T${timePart}:00`)
    }

    const dateTimeA = parseDateTime(a)
    const dateTimeB = parseDateTime(b)

    return dateTimeB - dateTimeA // latest first
  })

  if (loading) return <Loader message="Loading your trade history..." />
  if (error)
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )

  return (
    <div className=" min-h-screen bg-slate-900 text-white flex flex-col p-2 w-full  ">
      <div className=" flex justify-between items-center mb-6 px-5 py-6">
        <h2 className=" text-xl lg:text-3xl font-bold text-gray-200">
          All Trade Data
        </h2>
        <button
          onClick={openAddTradeForm}
          className="lg:px-6 lg:py-2 p-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 text-sm lg:text-base"
        >
          Add New Trade
        </button>
      </div>

      <div className=" overflow-x-scroll lg:overflow-hidden">
        <AllTradesTable
          trades={allTrades}
          onDeleteTrade={handleDeleteTrade}
          onEditTrade={openEditTradeForm}
        />
      </div>

      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="relative bg-zinc-800 rounded-lg shadow-xl text-white w-full max-w-4xl max-h-[90vh] mx-auto flex flex-col">
            <NewTradeEntryForm
              addTrade={handleAddTrade}
              updateTrade={handleUpdateTrade}
              onClose={closeFormModal}
              tradeToEdit={tradeToEdit}
            />
          </div>
        </div>
      )}
    </div>
  )
}
