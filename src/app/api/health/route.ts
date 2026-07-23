import { failure, success } from '@/lib/api-response';

export const runtime = 'nodejs';

export function GET() {
  try {
    return success({ service: 'english-learning-tool', status: 'ok' });
  } catch {
    return failure('INTERNAL_SERVER_ERROR', 'サーバー内部でエラーが発生しました。', 500);
  }
}
