import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import { useSharing } from "@/hooks/useSharing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareDialogProps {
  itemType: 'todo' | 'rock' | 'issue';
  itemId: number;
  trigger?: React.ReactNode;
}

export const ShareDialog = ({ itemType, itemId, trigger }: ShareDialogProps) => {
  const session = useSession();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const { shareItem, unshareItem, sharedItems } = useSharing();
  const [isOpen, setIsOpen] = useState(false);

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', session?.user?.id)
        .eq('active', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const isSharedWithUser = (userId: string) => {
    return sharedItems?.some(
      item => 
        item.item_type === itemType && 
        item.item_id === itemId && 
        item.shared_with === userId
    );
  };

  const handleShare = async (userId: string) => {
    if (isSharedWithUser(userId)) {
      await unshareItem.mutateAsync({
        itemType,
        itemId,
        sharedWithUserId: userId,
      });
    } else {
      await shareItem.mutateAsync({
        itemType,
        itemId,
        sharedWithUserId: userId,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share with Team Members</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Select
            value={selectedUserId}
            onValueChange={setSelectedUserId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a team member" />
            </SelectTrigger>
            <SelectContent>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name || user.username}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="w-full"
            onClick={() => {
              if (selectedUserId) {
                handleShare(selectedUserId);
              }
            }}
          >
            {isSharedWithUser(selectedUserId) ? 'Remove Share' : 'Share'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};