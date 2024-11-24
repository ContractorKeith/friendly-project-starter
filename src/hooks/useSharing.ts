import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

interface ShareItemParams {
  itemType: 'todo' | 'rock' | 'issue';
  itemId: number;
  sharedWithUserId: string;
}

export const useSharing = () => {
  const { toast } = useToast();
  const session = useSession();
  const queryClient = useQueryClient();

  const shareItem = useMutation({
    mutationFn: async ({ itemType, itemId, sharedWithUserId }: ShareItemParams) => {
      const { error } = await supabase
        .from('shared_items')
        .insert({
          item_type: itemType,
          item_id: itemId,
          shared_by: session?.user?.id,
          shared_with: sharedWithUserId,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared_items'] });
      toast({
        title: "Success",
        description: "Item shared successfully",
      });
    },
  });

  const unshareItem = useMutation({
    mutationFn: async ({ itemType, itemId, sharedWithUserId }: ShareItemParams) => {
      const { error } = await supabase
        .from('shared_items')
        .delete()
        .match({
          item_type: itemType,
          item_id: itemId,
          shared_with: sharedWithUserId,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shared_items'] });
      toast({
        title: "Success",
        description: "Sharing removed successfully",
      });
    },
  });

  const { data: sharedItems } = useQuery({
    queryKey: ['shared_items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shared_items')
        .select('*')
        .or(`shared_with.eq.${session?.user?.id},shared_by.eq.${session?.user?.id}`);
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return {
    shareItem,
    unshareItem,
    sharedItems,
  };
};