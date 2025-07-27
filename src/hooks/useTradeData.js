// hooks/useTradeData.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type");
  return contentType?.includes("application/json")
    ? await response.json()
    : await response.text();
};

const calculateGrossPnl = (trade) => {
  if (trade.entryPrice && trade.exitPrice && trade.quantity) {
    if (trade.direction === "Long") {
      return (trade.exitPrice - trade.entryPrice) * trade.quantity;
    } else if (trade.direction === "Short") {
      return (trade.entryPrice - trade.exitPrice) * trade.quantity;
    }
  }
  return 0;
};

const getTradeCharges = (trade) => {
  return trade.charges ?? 0;
};

const processTradeData = (trades) => {
  return trades.map((trade) => ({
    ...trade,
    dateTime: new Date(`${trade.date}T${trade.time}`),
    pnlAmount: parseFloat(trade.pnlAmount || trade.netPnl || 0),
    grossPnl: calculateGrossPnl(trade),
    charges: getTradeCharges(trade),
  }));
};

export const useTradeData = (session) => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTradeHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const storedData = localStorage.getItem("tradeJournalData");
        if (storedData) {
          const data = JSON.parse(storedData);
          setTradeHistory(processTradeData(data));
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn(
        "Failed to load trade data from local storage, attempting API:",
        err
      );
    }

    if (!session?.user?.id) {
      setError("User not authenticated. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/trades");
      if (!res.ok) {
        const body = await parseResponseBody(res);
        const errorMessage =
          typeof body === "object" && body.message
            ? body.message
            : body.toString();
        throw new Error(errorMessage || res.statusText);
      }
      const data = await res.json();
      setTradeHistory(processTradeData(data.tradeHistory));
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(
          "tradeJournalData",
          JSON.stringify(data.tradeHistory)
        );
      }
    } catch (err) {
      console.error("Failed to load dashboard data from API:", err);
      setError(err.message || "Failed to load data from API.");
      toast.error(err.message || "Failed to load data from API.");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchTradeHistory();
  }, [fetchTradeHistory]);

  const addTrade = useCallback(
    async (newTrade) => {
      try {
        const processedNewTrade = {
          ...newTrade,
          dateTime: new Date(`${newTrade.date}T${newTrade.time}`),
          pnlAmount: parseFloat(newTrade.pnlAmount || newTrade.netPnl || 0),
          grossPnl: calculateGrossPnl(newTrade),
          charges: getTradeCharges(newTrade),
        };

        setTradeHistory((prev) => {
          const updatedHistory = [...prev, processedNewTrade];
          if (typeof window !== "undefined" && window.localStorage) {
            // Store the raw trade data before processing for consistency with fetch
            const rawTrades = updatedHistory.map(({ dateTime, pnlAmount, grossPnl, charges, ...rest }) => rest);
            localStorage.setItem(
              "tradeJournalData",
              JSON.stringify(rawTrades)
            );
          }
          return updatedHistory;
        });
        toast.success("Trade added successfully!");

        const res = await fetch("/api/v1/trades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTrade),
        });
        if (!res.ok) {
          const body = await parseResponseBody(res);
          const errorMessage =
            typeof body === "object" && body.message
              ? body.message
              : body.toString();
          throw new Error(errorMessage || res.statusText);
        }
        // Re-fetch data to ensure server-side consistency and pick up any server-generated IDs/data
        fetchTradeHistory();
      } catch (err) {
        console.error("Failed to add new trade:", err);
        setError(err.message || "Failed to add new trade.");
        toast.error(err.message || "Failed to add new trade.");
        // If API call fails, revert local state or re-fetch to sync
        fetchTradeHistory();
      }
    },
    [fetchTradeHistory]
  );

  return { tradeHistory, isLoading, error, addTrade, fetchTradeHistory };
};