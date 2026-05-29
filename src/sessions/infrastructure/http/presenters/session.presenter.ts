import { Session } from '../../../domain/session.entity';
import { SessionResponseDto } from '../controllers/dto/session-response.dto';

export class SessionPresenter {
  static toResponse(session: Session): SessionResponseDto {
    return {
      id: session.id,
      userId: session.userId,
      alias: session.alias,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    };
  }
}
