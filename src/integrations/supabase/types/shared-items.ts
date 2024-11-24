export interface SharedItem {
  id: number;
  item_type: 'todo' | 'rock' | 'issue';
  item_id: number;
  shared_by: string;
  shared_with: string;
  created_at: string;
}