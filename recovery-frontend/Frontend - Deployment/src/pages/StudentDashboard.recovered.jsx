import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import { useState, useEffect, useRef } from "react";
import { getApiUrl } from "../utils/config";
import SubjectCard from "../components/StudentSubjectCard";
import DashboardCarousel from "../components/DashboardCarousel";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [subjectID, setSubjectID] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const suggestionsRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const apiUrl = getApiUrl();
  const [showForm, setShowForm] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [ongoingExam, setOngoingExam] = useState(null);

  // New state for subject cards
  const [subjectGroups, setSubjectGroups] = useState([]);

  const resetForm = () => {
    setSubjectInput("");
    setSubjectID("");
    setSubjectError("");
    setError("");
    setLoading(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }

      // Close form and reset when clicking outside
      if (showForm && !event.target.closest(".lightbox-bg")) {
        setShowForm(false);
        resetForm();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showForm]);

  // Filter subjects based on input
  useEffect(() => {
    setIsSearchLoading(true);
    const filtered = subjects.filter(
      (subject) =>
        !subjectInput.trim() ||
        subject.subjectName
          .toLowerCase()
          .includes(subjectInput.toLowerCase()) ||
        subject.subjectCode.toLowerCase().includes(subjectInput.toLowerCase()),
    );
    setFilteredSubjects(filtered);
    // Simulate loading state for 500ms
    setTimeout(() => {
      setIsSearchLoading(false);
    }, 500);
  }, [subjectInput, subjects]);

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = (e) => {
    // Add a small delay to allow click events on suggestions to fire first
    setTimeout(() => {
      // Only hide suggestions if we're not clicking on a suggestion
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
      }
    }, 200);
  };

  // Fetch available subjects when component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/student/practice-subjects`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (data.data) {
          setSubjects(data.data);
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects");
      }
    };

    fetchSubjects();
  }, [apiUrl]);

  // Fetch subjects for cards view (using the flat list)
  useEffect(() => {
    const fetchDashboardSubjects = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/student/practice-subjects`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (data.data) {
          setSubjectGroups(data.data); // Keep state name for compatibility, but it holds flat objects now
        }
      } catch (err) {
        console.error("Error fetching dashboard subjects:", err);
      }
    };

    fetchDashboardSubjects();
  }, [apiUrl]);

  // Check for ongoing exam when component mounts
  useEffect(() => {
    const checkOngoingExam = () => {
      // Get all localStorage keys
      const keys = Object.keys(localStorage);
      // Find exam keys (they start with 'exam_')
      const examKeys = keys.filter((key) => key.startsWith("exam_"));

      if (examKeys.length > 0) {
        // Get the most recent exam (assuming there's only one ongoing exam)
        const examKey = examKeys[0];
        try {
          // Check if this exam has been completed
          const examCompleted = localStorage.getItem(`${examKey}_completed`);
          if (examCompleted === "true") {
            // Clear completed exam data
            const keysToRemove = [
              examKey,
              `${examKey}_bookmarks`,
              `${examKey}_timer`,
              `${examKey}_completed`,
              `${examKey}_last_question`,
              `${examKey}_last_position`,
            ];
            keysToRemove.forEach((key) => localStorage.removeItem(key));
            return;
          }

          const savedAnswers = JSON.parse(localStorage.getItem(examKey));
          const savedBookmarks =
            JSON.parse(localStorage.getItem(`${examKey}_bookmarks`)) || [];
          const savedTimer = localStorage.getItem(`${examKey}_timer`);

          // If timer exists and is 0, exam is completed
          if (savedTimer && parseInt(savedTimer) === 0) {
            // Clear completed exam data
            const keysToRemove = [
              examKey,
              `${examKey}_bookmarks`,
              `${examKey}_timer`,
              `${examKey}_completed`,
              `${examKey}_last_question`,
              `${examKey}_last_position`,
            ];
            keysToRemove.forEach((key) => localStorage.removeItem(key));
            return;
          }

          // Extract subject ID from the exam key (format: exam_subjectID_...)
          const subjectID = examKey.split("_")[1];

          // Get the exam data from the API
          fetch(`${apiUrl}/api/practice-exam/generate/${subjectID}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.questions) {
                setOngoingExam({
                  subjectID,
                  examData: data,
                  savedAnswers,
                  savedBookmarks,
                  examKey,
                });
              }
            })
            .catch((err) => {
              console.error("Error fetching exam data:", err);
              // If there's an error, clear the saved exam
              const keysToRemove = [
                examKey,
                `${examKey}_bookmarks`,
                `${examKey}_timer`,
                `${examKey}_completed`,
                `${examKey}_last_question`,
                `${examKey}_last_position`,
              ];
              keysToRemove.forEach((key) => localStorage.removeItem(key));
            });
        } catch (err) {
          console.error("Error parsing saved exam:", err);
          // If there's an error parsing, clear the saved exam
          const keysToRemove = [
            examKey,
            `${examKey}_bookmarks`,
            `${examKey}_timer`,
            `${examKey}_completed`,
            `${examKey}_last_question`,
            `${examKey}_last_position`,
          ];
          keysToRemove.forEach((key) => localStorage.removeItem(key));
        }
      }
    };

    checkOngoingExam();
  }, [apiUrl]);

  const handleContinueExam = () => {
    if (ongoingExam) {
      navigate("/practice-exam", {
        state: {
          subjectID: ongoingExam.subjectID,
          examData: ongoingExam.examData,
          savedAnswers: ongoingExam.savedAnswers,
          savedBookmarks: ongoingExam.savedBookmarks,
          examKey: ongoingExam.examKey,
        },
      });
    }
  };

  const handleStartExam = () => {
    setExamStarted(true);
  };

  const handleGenerateExam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSubjectError("");

    // Validate subject selection
    if (!subjectID) {
      setSubjectError("Please select a valid subject");
      setLoading(false);
      return;
    }

    // Clear all existing exam data before starting new exam
    const clearExistingExamData = () => {
      const keys = Object.keys(localStorage);
      const examKeys = keys.filter((key) => key.startsWith("exam_"));
      examKeys.forEach((key) => {
        // Remove all exam-related keys
        const keysToRemove = [
          key,
          `${key}_bookmarks`,
          `${key}_timer`,
          `${key}_completed`,
          `${key}_last_question`,
          `${key}_last_position`,
          `${key}_settings`,
          `${key}_exam_data`,
        ];
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      });
    };

    try {
      // Clear existing exam data before generating new exam
      clearExistingExamData();

      const response = await fetch(
        `${apiUrl}/api/practice-exam/generate/${subjectID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error("Unexpected response format: " + text.slice(0, 100));
      }

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Practice exam is not enabled for this subject.");
        }
        if (response.status === 404) {
          throw new Error(
            data.message ||
            "Subject not found or no questions available for this subject.",
          );
        }
        throw new Error(data.message || "Failed to generate exam");
      }

      if (!data.questions || data.questions.length === 0) {
        setError(
          "No questions available for this subject. Please try another subject.",
        );
        setLoading(false);
        return;
      }

      // Generate a unique key for this exam attempt
      const examKey = `exam_${subjectID}_${data.questions.map((q) => q.questionID).join("_")}`;

      // Store the complete exam data in localStorage with its own settings
      localStorage.setItem(
        `${examKey}_exam_data`,
        JSON.stringify({
          questions: data.questions,
          totalPoints: data.totalPoints,
          enableTimer: data.enableTimer,
          durationMinutes: data.durationMinutes,
          subjectName: data.subjectName,
          // Store the exam settings separately from the subject settings
          examSettings: {
            enableTimer: data.enableTimer,
            durationMinutes: data.durationMinutes,
          },
        }),
      );

      // Navigate to /exam-preview with all the exam data
      navigate("/exam-preview", {
        state: {
          subjectID,
          examData: {
            questions: data.questions,
            totalPoints: data.totalPoints,
            enableTimer: data.enableTimer,
            durationMinutes: data.durationMinutes,
            subjectName: data.subjectName,
            // Include the exam settings in the state
            examSettings: {
              enableTimer: data.enableTimer,
              durationMinutes: data.durationMinutes,
            },
          },
          examKey,
        },
      });
    } catch (err) {
      console.error("Exam generation error:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = (subject) => {
    setSubjectInput(subject.subjectName);
    setSubjectID(subject.subjectID);
    setShowSuggestions(false); // Close the suggestions dropdown
  };

  /**
   * Reusable function to start the exam flow by fetching questions 
   * and navigating to the preview page.
   */
  const startExamFlow = async (id, name) => {
    setLoading(true);
    setError("");
    setSubjectError("");

    // Clear all existing exam data before starting new exam
    const clearExistingExamData = () => {
      const keys = Object.keys(localStorage);
      const examKeys = keys.filter((key) => key.startsWith("exam_"));
      examKeys.forEach((key) => {
        const keysToRemove = [
          key,
          `${key}_bookmarks`,
          `${key}_timer`,
          `${key}_completed`,
          `${key}_last_question`,
          `${key}_last_position`,
          `${key}_settings`,
          `${key}_exam_data`,
        ];
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      });
    };

    clearExistingExamData();

    try {
      const response = await fetch(
        `${apiUrl}/api/practice-exam/generate/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Practice exam is not enabled for this subject.");
        }
        if (response.status === 404) {
          throw new Error(
            data.message ||
            "Subject not found or no questions available for this subject.",
          );
        }
        throw new Error(data.message || "Failed to generate exam");
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error(
          "No questions available for this subject. Please try another subject.",
        );
      }

      // Generate a unique key for this exam attempt
      const examKey = `exam_${id}_${data.questions.map((q) => q.questionID).join("_")}`;

      // Store the complete exam data in localStorage
      localStorage.setItem(
        `${examKey}_exam_data`,
        JSON.stringify({
          questions: data.questions,
          totalPoints: data.totalPoints,
          enableTimer: data.enableTimer,
          durationMinutes: data.durationMinutes,
          subjectName: data.subjectName,
          examSettings: {
            enableTimer: data.enableTimer,
            durationMinutes: data.durationMinutes,
          },
        }),
      );

      // Navigate to /exam-preview
      navigate("/exam-preview", {
        state: { subjectID: id, examData: data, examKey },
      });
    } catch (err) {
      console.error("Exam generation error:", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Handle card click — go straight to exam flow
  const handleCardClick = (subject) => {
    startExamFlow(subject.subjectID, subject.subjectName);
  };

  return (
    <div className="font-inter mt-10 text-center text-slate-600 dark:text-slate-300">
      {/* Draft
      {ongoingExam && (
        <div className="mb-6">
          <div className="mx-auto max-w-md rounded-lg bg-yellow-50 p-4 shadow-sm">
            <h3 className="mb-2 text-[16px] font-semibold text-yellow-800">
              Exam in Progress
            </h3>
            <p className="mb-4 text-[12px] text-yellow-700">
              You have an unfinished practice exam for Subject{" "}
              {ongoingExam.subjectID}. Your progress has been saved.
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleContinueExam}
                className="font-inter mt-3 flex items-center justify-center gap-2 text-[14px] text-gray-700 dark:text-gray-300"
              >
                <span className="hover:underline">Continue Exam</span>
                <i className="bx bx-chevron-right text-[18px]"></i>
              </button>
            </div>
          </div>
        </div>
      )}
        */}

      <div className="mx-auto flex w-full max-w-md flex-col gap-4 sm:gap-[clamp(1rem,3.5vw,1.35rem)] pb-8">
        <DashboardCarousel />

        <section className="flex flex-col gap-3 sm:gap-[clamp(0.85rem,3vw,1rem)]">
          <div className="px-0.5">
            <h2 className="text-[clamp(1.35rem,4.8vw,1.7rem)] font-semibold tracking-tight text-slate-900 dark:text-white">
              Subjects
            </h2>
          </div>

          {subjectGroups.length > 0 ? (
            <div className="flex flex-col gap-4">
              {subjectGroups.map((subject) => (
                <SubjectCard
                  key={subject.subjectID}
                  baseName={subject.subjectName}
                  subjectImage={null}
                  onClick={() => handleCardClick(subject)}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[30px] border border-slate-200/70 bg-white/88 px-8 py-10 text-center shadow-[0_24px_44px_rgba(148,163,184,0.16)] dark:border-white/8 dark:bg-slate-950/92 dark:shadow-[0_24px_44px_rgba(2,6,23,0.28)]">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-orange-500/12 text-orange-500 dark:bg-orange-500/15 dark:text-orange-400">
                <i className="bx bx-book-reader text-3xl"></i>
              </div>
              <h3 className="mb-2 text-[clamp(1.2rem,4.3vw,1.3rem)] font-semibold tracking-tight text-slate-950 dark:text-white">
                No Subjects Yet
              </h3>
              <p className="max-w-[16rem] text-[clamp(0.92rem,2.9vw,0.98rem)] leading-6 text-slate-500 dark:text-slate-400">
                When you're enrolled in subjects, they will appear here.
              </p>
            </div>
          )}
        </section>
      </div>

      {loading && (
        <div className="fixed inset-0 z-110 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-slate-950/72">
          <span className="loader mb-4"></span>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Preparing your questions...
          </p>
        </div>
      )}

      {error && (
        <div
          className="fixed inset-0 z-110 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setError("")}
        >
          <div
            className="w-full max-w-sm rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-white/8 dark:bg-slate-950"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 dark:bg-red-500/12 dark:text-red-400">
              <i className="bx bx-error-alt text-2xl"></i>
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-950 dark:text-white">
              Exam preparation issue
            </h3>
            <p className="mb-6 text-sm leading-6 text-slate-500 dark:text-slate-400">{error}</p>
            <button
              onClick={() => setError("")}
              className="w-full rounded-2xl bg-slate-100 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
