import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase';

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    // Subscribe to todos changes
    const todosSubscription = supabase
      .channel('todos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['todos', userId] });
        }
      )
      .subscribe();

    // Subscribe to rocks changes
    const rocksSubscription = supabase
      .channel('rocks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rocks' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['rocks', userId] });
        }
      )
      .subscribe();

    // Subscribe to issues changes
    const issuesSubscription = supabase
      .channel('issues-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['issues', userId] });
        }
      )
      .subscribe();

    // Subscribe to scorecard changes
    const scorecardSubscription = supabase
      .channel('scorecard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scorecard' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['scorecard', userId] });
        }
      )
      .subscribe();

    return () => {
      todosSubscription.unsubscribe();
      rocksSubscription.unsubscribe();
      issuesSubscription.unsubscribe();
      scorecardSubscription.unsubscribe();
    };
  }, [queryClient, userId]);
};