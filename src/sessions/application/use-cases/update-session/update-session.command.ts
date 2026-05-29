export interface UpdateSessionCommand {
  id: string;
  alias?: string;
  updatedBy?: string | null;
}
