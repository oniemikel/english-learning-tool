import { StudySession } from '@/components/study/study-session';

export default function StudyListeningPage() {
  return <StudySession title="リスニング学習" promptLabel="聞き取った単語" promptValue="[audio]" answerValue="commute" withInput />;
}
