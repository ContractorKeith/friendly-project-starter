import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useRealtimeSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to todos changes
    const todosSubscription = supabase
      .channel('todos-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
      )
      .subscribe();

    // Subscribe to rocks changes
    const rocksSubscription = supabase
      .channel('rocks-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rocks' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['rocks'] });
        }
      )
      .subscribe();

    // Subscribe to issues changes
    const issuesSubscription = supabase
      .channel('issues-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'issues' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['issues'] });
        }
      )
      .subscribe();

    // Subscribe to scorecard changes
    const scorecardSubscription = supabase
      .channel('scorecard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scorecard' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['scorecard'] });
        }
      )
      .subscribe();

    return () => {
      todosSubscription.unsubscribe();
      rocksSubscription.unsubscribe();
      issuesSubscription.unsubscribe();
      scorecardSubscription.unsubscribe();
    };
  }, [queryClient]);
};