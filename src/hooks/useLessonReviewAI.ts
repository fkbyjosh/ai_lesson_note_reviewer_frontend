
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface LessonReviewFeedback {
  clarity: string;
  structure: string;
  content: string;
  suggestions: string;
  overall: string;
}

export function useLessonReviewAI() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<LessonReviewFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function reviewLessonNote({
    lessonTitle,
    subject,
    classGroup,
    noteContent,
  }: {
    lessonTitle: string;
    subject: string;
    classGroup: string;
    noteContent: string;
  }) {
    setLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const { data, error: funcError } = await supabase.functions.invoke("review-lesson-note", {
        body: { lessonTitle, subject, classGroup, noteContent },
      });
      if (funcError) throw funcError;
      setFeedback(data as LessonReviewFeedback);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    }
    setLoading(false);
  }

  return { feedback, reviewLessonNote, loading, error };
}
