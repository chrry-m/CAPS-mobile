import { useEffect, useMemo, useState } from "react";
import FaqAccordion from "./FaqAccordion";
import GuidedActionsPanel from "./GuidedActionsPanel";
import SupportRequestForm from "./SupportRequestForm";
import { getFaqs, submitSupportRequest } from "../services/helpService";

// Render the help center modal component.
const HelpCenterModal = ({ isOpen, onClose, showToast }) => {
  const [faqs, setFaqs] = useState([]);
  const [activeFaqId, setActiveFaqId] = useState(null);
  const [formData, setFormData] = useState({ subject: "", message: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    getFaqs().then((response) => {
      setFaqs(response.data || []);
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // Prevent background scroll so the bottom sheet feels native on mobile and
    // does not fight with the dashboard underneath it.
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sortedFaqs = useMemo(
    () => [...faqs].sort((a, b) => a.sort_order - b.sort_order),
    [faqs],
  );

  // Handle change.
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  // Handle submit.
  const handleSubmit = async (event) => {
    event.preventDefault();
    const subject = formData.subject.trim();
    const message = formData.message.trim();

    // Keep validation local and lightweight here; backend validation will
    // enforce the same shape once the mock service is replaced.
    if (!subject || !message) {
      setError("Please complete both the subject and message fields.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await submitSupportRequest({ subject, message });
      showToast?.(response.message, "success");
      setFormData({ subject: "", message: "" });
      onClose();
    } catch (submitError) {
      setError("Unable to submit your request right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="lightbox-bg fixed inset-0 z-[180] flex items-end justify-center bg-black/40 min-[448px]:items-center">
      <div className="max-h-[92vh] w-full max-w-xl overflow-hidden rounded-t-3xl bg-gray-50 shadow-2xl min-[448px]:rounded-3xl dark:bg-black">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-white/10">
          <div>
            <h2 className="text-[18px] font-semibold text-gray-900 dark:text-white">
              Help Center
            </h2>
            <p className="mt-1 text-[12px] text-gray-500 dark:text-gray-300">
              FAQs, guided help, and support requests in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10"
          >
            <i className="bx bx-x text-2xl"></i>
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto px-5 py-5">
          <section>
            <h3 className="mb-3 text-[14px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-300">
              Frequently Asked Questions
            </h3>
            <FaqAccordion
              faqs={sortedFaqs}
              activeId={activeFaqId}
              onToggle={(id) =>
                setActiveFaqId((current) => (current === id ? null : id))
              }
            />
          </section>

          <section>
            <h3 className="mb-3 text-[14px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-300">
              Guided Navigation
            </h3>
            <GuidedActionsPanel onNavigate={onClose} />
          </section>

          <section>
            <h3 className="mb-3 text-[14px] font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-300">
              Report a Problem
            </h3>
            <SupportRequestForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              error={error}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterModal;
