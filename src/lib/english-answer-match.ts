const PUNCTUATION_OR_SYMBOL_REGEX = /[\p{P}\p{S}]/gu;

function normalizeEnglishToken(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(PUNCTUATION_OR_SYMBOL_REGEX, ' ')
    .replace(/\s+/g, ' ');
}

function splitAcceptedAnswers(targetAnswer: string): string[] {
  return targetAnswer
    .split(/[,/]/)
    .map((candidate) => normalizeEnglishToken(candidate))
    .filter((candidate, index, list) => candidate.length > 0 && list.indexOf(candidate) === index);
}

export function isEnglishAnswerMatch(targetAnswer: string, typedAnswer: string): boolean {
  const normalizedTypedAnswer = normalizeEnglishToken(typedAnswer);
  if (!normalizedTypedAnswer) {
    return false;
  }

  const acceptedAnswers = splitAcceptedAnswers(targetAnswer);
  if (acceptedAnswers.length === 0) {
    return false;
  }

  return acceptedAnswers.includes(normalizedTypedAnswer);
}
