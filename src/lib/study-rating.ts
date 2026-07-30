export const studyFsrsRatingValues = ['again', 'hard', 'good', 'easy'] as const;
export type StudyFsrsRating = (typeof studyFsrsRatingValues)[number];

export const studyBinaryRatingValues = ['incorrect', 'correct'] as const;
export type StudyBinaryRating = (typeof studyBinaryRatingValues)[number];

export const studySubmittedRatingValues = ['again', 'hard', 'good', 'easy', 'incorrect', 'correct'] as const;
export type StudySubmittedRating = (typeof studySubmittedRatingValues)[number];

export const studyAssessmentModeValues = ['FSRS_FOUR_BUTTON', 'BINARY'] as const;
export type StudyAssessmentMode = (typeof studyAssessmentModeValues)[number];

export const binaryCorrectMappingValues = ['good', 'easy'] as const;
export type BinaryCorrectMapping = (typeof binaryCorrectMappingValues)[number];

export const DEFAULT_ASSESSMENT_MODE: StudyAssessmentMode = 'FSRS_FOUR_BUTTON';
export const DEFAULT_BINARY_CORRECT_MAPPING: BinaryCorrectMapping = 'good';

export type StudyCorrectnessStatus = StudyBinaryRating;

export type StudyReviewSubmission = {
  isCorrect: boolean;
  rating: StudyFsrsRating;
};

export function resolveFsrsRating(
  rating: StudySubmittedRating,
  correctMapping: BinaryCorrectMapping = DEFAULT_BINARY_CORRECT_MAPPING,
): StudyFsrsRating {
  if (rating === 'incorrect') {
    return 'again';
  }

  if (rating === 'correct') {
    return correctMapping;
  }

  return rating;
}

export function isCorrectSubmission(rating: StudySubmittedRating): boolean {
  return rating !== 'again' && rating !== 'incorrect';
}

export function toCorrectnessStatus(isCorrect: boolean): StudyCorrectnessStatus {
  return isCorrect ? 'correct' : 'incorrect';
}
