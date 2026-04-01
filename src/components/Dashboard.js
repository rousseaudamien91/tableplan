/* eslint-disable */
import { useState } from "react";
import PricingPage from "./pricing/PricingPage";
import OnboardingWizard from "./OnboardingWizard";
import VoucherModal from "./VoucherModal";
import { useTheme, THEMES_CONFIG, C } from "../theme";
import Modal from "./ui/Modal.jsx";
import Field from "./ui/Field";
import Input from "./ui/Input";
import Btn from "./ui/Btn";

function Dashboard({
  user,
  events,
  setEvents,
  onLogout,
  onOpenEvent,
  t,
  lang,
  setLang,
  guestMode
}) {
  const { theme } = useTheme("light");

  const [showNew, setShowNew] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  const [newEv, setNewEv] = useState({
    name: "",
    date: "",
    type: "mariage",
  });

  function createEvent() {
    const ev = {
      id: Date.now(),
      ownerId: user.id,
      name: newEv.name,
      date: newEv.date,
      type: newEv.type,
      plan: "free",
      roomShape: "rectangle",
      tables: [],
      guests: [],
      constraints: [],
      menu: null,
    };
    setEvents(prev => [...prev, ev]);
    setShowNew(false);
    onOpenEvent(ev.id);
  }

  function handleApplyVoucher(voucher) {
    set
