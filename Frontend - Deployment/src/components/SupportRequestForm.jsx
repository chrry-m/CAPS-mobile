// Render the support request form component.
const SupportRequestForm = ({
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  error,
}) => {
  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div>
        <label className="mb-1 block text-[13px] font-medium text-gray-700 dark:text-gray-200">
          Subject
        </label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={onChange}
          placeholder="Briefly describe the issue"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-[14px] text-gray-900 transition outline-none focus:border-orange-500 dark:border-white/10 dark:bg-[var(--color-bg-tertiary)] dark:text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-[13px] font-medium text-gray-700 dark:text-gray-200">
          Message
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={onChange}
          rows={4}
          placeholder="Tell us what happened and where you got stuck."
          className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-[14px] text-gray-900 transition outline-none focus:border-orange-500 dark:border-white/10 dark:bg-[var(--color-bg-tertiary)] dark:text-white"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-500 dark:bg-red-950/40">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-orange-500 px-4 py-3 text-[14px] font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-500"
      >
        {isSubmitting ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
};

export default SupportRequestForm;
