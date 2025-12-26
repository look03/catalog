import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

export function getDetailsErrorUtil(error: any): string {
  if (error instanceof InternalServerErrorException || error instanceof NotFoundException) {
    return String(error);
  }

  return error instanceof Error ? error.message : String(error);
}
