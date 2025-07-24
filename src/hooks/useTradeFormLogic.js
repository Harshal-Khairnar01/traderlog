
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const initialFormData = {
  marketType: "Indian",
  symbol: "",
  date: "",
  time: "",
  entryPrice: "",
  quantity: "",
  totalAmount: "",
  exitPrice: "",
  pnlAmount: "",
  pnlPercentage: "",
  direction: "Long",
  optionType: "",
  stopLoss: "",
  target: "",
  riskReward: "",
  strategy: "Select Strategy",
  outcomeSummary: "Select Outcome Summary",
  tradeAnalysis: "",
  emotionsBefore: "Calm",
  emotionsAfter: "Satisfied",
  tradeNotes: "",
  mistakes: "",
  mistakeChecklist: [],
  whatDidWell: "",
  tags: "",
  screenshotUpload: null,
  charges: "",
  confidenceLevel: "5",
};

export const useTradeFormLogic = (tradeToEdit) => {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (tradeToEdit) {
      setFormData({
        marketType: tradeToEdit.marketType || "Indian",
        symbol: tradeToEdit.symbol || "",
        date: tradeToEdit.date || "",
        time: tradeToEdit.time || "",
        entryPrice: tradeToEdit.entryPrice || "",
        quantity: tradeToEdit.quantity || "",
        totalAmount: tradeToEdit.totalAmount || "",
        exitPrice: tradeToEdit.exitPrice || "",
        pnlAmount: tradeToEdit.pnlAmount || "",
        pnlPercentage: tradeToEdit.pnlPercentage || "",
        direction: tradeToEdit.direction || "Long",
        optionType: tradeToEdit.optionType || "",
        stopLoss: tradeToEdit.stopLoss || "",
        target: tradeToEdit.target || "",
        riskReward: tradeToEdit.riskReward || "",
        strategy: tradeToEdit.strategy || "Select Strategy",
        outcomeSummary: tradeToEdit.outcomeSummary || "Select Outcome Summary",
        tradeAnalysis: tradeToEdit.tradeAnalysis || "",
        emotionsBefore: tradeToEdit.emotionsBefore || "Calm",
        emotionsAfter: tradeToEdit.emotionsAfter || "Satisfied",
        tradeNotes: tradeToEdit.tradeNotes || "",
        mistakes: tradeToEdit.mistakes || "",
        mistakeChecklist: tradeToEdit.mistakeChecklist || [],
        whatDidWell: tradeToEdit.whatDidWell || "",
        tags: tradeToEdit.tags || "",
        screenshotUpload: null,
        charges: tradeToEdit.charges || "",
        confidenceLevel: tradeToEdit.confidenceLevel || "5",
      });
    }
  }, [tradeToEdit]);

  useEffect(() => {
    const entry = parseFloat(formData.entryPrice);
    const qty = parseFloat(formData.quantity);
    let calculatedTotalAmount = "";
    if (!isNaN(entry) && !isNaN(qty) && qty > 0) {
      calculatedTotalAmount = (entry * qty).toFixed(2);
    }
    if (formData.totalAmount !== calculatedTotalAmount) {
      setFormData((prev) => ({ ...prev, totalAmount: calculatedTotalAmount }));
    }
  }, [formData.entryPrice, formData.quantity, formData.totalAmount]);

  useEffect(() => {
    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const pnlAmtManual = parseFloat(formData.pnlAmount);
    const totalAmt = parseFloat(formData.totalAmount);
    const charges = parseFloat(formData.charges) || 0;
    
    let calculatedPnlAmount = "";
    let calculatedPnlPercentage = "";
    
    if (!isNaN(entry) && !isNaN(exit) && !isNaN(parseFloat(formData.quantity)) && parseFloat(formData.quantity) > 0) {
      const qty = parseFloat(formData.quantity);
      let grossPnl;
      if (formData.direction === "Long") {
        grossPnl = (exit - entry) * qty;
      } else {
        grossPnl = (entry - exit) * qty;
      }
      const netPnl = grossPnl - charges;
      calculatedPnlAmount = netPnl.toFixed(2);
      if (!isNaN(totalAmt) && totalAmt !== 0) {
        calculatedPnlPercentage = ((netPnl / totalAmt) * 100).toFixed(2);
      }
    } else if (!isNaN(pnlAmtManual) && !isNaN(totalAmt) && totalAmt !== 0) {
      const netPnl = pnlAmtManual - charges;
      calculatedPnlAmount = netPnl.toFixed(2);
      calculatedPnlPercentage = ((netPnl / totalAmt) * 100).toFixed(2);
    }
    
    if (formData.pnlAmount !== calculatedPnlAmount) {
      setFormData((prev) => ({ ...prev, pnlAmount: calculatedPnlAmount }));
    }
    
    if (formData.pnlPercentage !== calculatedPnlPercentage) {
      setFormData((prev) => ({ ...prev, pnlPercentage: calculatedPnlPercentage }));
    }
  }, [formData.entryPrice, formData.exitPrice, formData.direction, formData.quantity, formData.pnlAmount, formData.totalAmount, formData.pnlPercentage, formData.charges]);

  useEffect(() => {
    const entry = parseFloat(formData.entryPrice);
    const stopLoss = parseFloat(formData.stopLoss);
    const target = parseFloat(formData.target);
    let calculatedriskReward = "";
    if (!isNaN(entry) && !isNaN(stopLoss) && !isNaN(target)) {
      let risk, reward;
      if (formData.direction === "Long") {
        risk = entry - stopLoss;
        reward = target - entry;
      } else {
        risk = stopLoss - entry;
        reward = entry - target;
      }
      if (risk > 0 && reward > 0) {
        calculatedriskReward = (reward / risk).toFixed(2);
      }
    }
    if (formData.riskReward !== calculatedriskReward) {
      setFormData((prev) => ({ ...prev, riskReward: calculatedriskReward }));
    }
  }, [formData.entryPrice, formData.stopLoss, formData.target, formData.direction, formData.riskReward]);

  const handleChange = (e) => {
    const { id, value, type, name } = e.target;
    if (type === "radio") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    } else if (type === "file") {
      setFormData((prevData) => ({ ...prevData, [id]: e.target.files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [id]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      mistakeChecklist: checked
        ? [...prev.mistakeChecklist, value]
        : prev.mistakeChecklist.filter((item) => item !== value),
    }));
  };

  const handleSubmit = (e, addTrade, updateTrade, onClose) => {
    e.preventDefault();
    const requiredFields = ["date", "time", "symbol", "quantity", "entryPrice"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error(`Please fill in all required trade details: ${field}`);
        return;
      }
    }
    const tradeDataToSave = {
      ...formData,
      quantity: Number(formData.quantity),
      entryPrice: Number(formData.entryPrice),
      exitPrice: formData.exitPrice ? Number(formData.exitPrice) : null,
      totalAmount: formData.totalAmount ? Number(formData.totalAmount) : null,
      pnlAmount: formData.pnlAmount ? Number(formData.pnlAmount) : null,
      pnlPercentage: formData.pnlPercentage ? Number(formData.pnlPercentage) : null,
      stopLoss: formData.stopLoss ? Number(formData.stopLoss) : null,
      target: formData.target ? Number(formData.target) : null,
      charges: formData.charges ? Number(formData.charges) : null,
      riskReward: formData.riskReward ? Number(formData.riskReward) : null,
      screenshotUpload: formData.screenshotUpload ? formData.screenshotUpload.name : (tradeToEdit?.screenshotUpload || null),
      confidenceLevel: Number(formData.confidenceLevel),
    };
    if (tradeToEdit) {
      updateTrade({ ...tradeDataToSave, id: tradeToEdit.id });
      toast.success("Trade updated successfully!");
    } else {
      addTrade(tradeDataToSave);
      toast.success("Trade submitted and added to history!");
    }
    if (!tradeToEdit) {
      setFormData(initialFormData);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleReset = () => {
    if (tradeToEdit) {
      setFormData({
        marketType: tradeToEdit.marketType || "Indian",
        riskReward: tradeToEdit.riskReward || "",
      });
      toast.info("Form reset to original values!");
    } else {
      setFormData(initialFormData);
      toast.info("Form reset!");
    }
  };

  return {
    formData,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    handleReset,
  };
};