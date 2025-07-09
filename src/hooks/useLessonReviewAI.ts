
import { useState } from "react";
import { apiService } from "@/services/api";

export interface LessonReviewFeedback {
  id: number;
  reviewer: string;
  feedback_text: string;
  score: number;
  strengths: string;
  suggestions: string;
  areas_for_improvement: string;
  overall_assessment: string;
  created_at: string;
}

export function useLessonReviewAI() {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<LessonReviewFeedback[] | null>(null);
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
      // First create the lesson note
      const lessonNote = await apiService.createLessonNote({
        subject,
        grade_level: classGroup,
        term: "Current", // You might want to make this configurable
        content: noteContent,
      });

      // Request AI feedback for the created lesson note
      await apiService.requestAIFeedback(lessonNote.id);

      // Get the feedback
      const feedbackResponse = await apiService.getFeedback(lessonNote.id);
      setFeedback(feedbackResponse);
      
    } catch (err: any) {
      let errorMessage = "Unknown error occurred";
      
      try {
        const errorData = JSON.parse(err.message);
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors) {
          errorMessage = errorData.non_field_errors.join(", ");
        } else {
          // Handle field-specific errors
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(", ")}`)
            .join("; ");
          if (fieldErrors) errorMessage = fieldErrors;
        }
      } catch {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return { feedback, reviewLessonNote, loading, error };
}
