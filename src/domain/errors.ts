export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status = 500,
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = '指定されたデータが見つかりません。') {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message = 'データが競合しています。') {
    super(message, 'CONFLICT', 409);
  }
}

export class BadRequestError extends ApplicationError {
  constructor(message = '入力内容が不正です。') {
    super(message, 'BAD_REQUEST', 400);
  }
}

export class InternalServerError extends ApplicationError {
  constructor(message = 'データベース処理に失敗しました。') {
    super(message, 'INTERNAL_SERVER_ERROR', 500);
  }
}
