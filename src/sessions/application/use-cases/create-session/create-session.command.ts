export interface CreateSessionCommand {
  userId: string;
  alias?: string;
  createdBy?: string | null;
}
