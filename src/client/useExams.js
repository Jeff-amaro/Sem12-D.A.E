import { useCallback, useEffect, useState } from "react";
import { createExam, deleteExam, describeError, listExams } from "./api";

export default function useExams() {
  const [status, setStatus] = useState("loading");
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    setStatus("loading");
    setError(null);
    listExams({ signal: controller.signal })
      .then((data) => {
        if (cancelled) return;
        setExams(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        setExams([]);
        setError(describeError(err));
        setStatus("error");
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  const remove = useCallback(async (id) => {
    return false;
  }, []);

  const create = useCallback(async (title) => {
    return false;
  }, []);

  return { status, exams, error, actionError, saving, reload, remove, create };
}
