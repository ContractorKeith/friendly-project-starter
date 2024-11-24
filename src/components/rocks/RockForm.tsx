import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface RockFormProps {
  users?: { id: string; username: string }[];
  onSubmit: (data: { title: string; owner_id: string; due_date?: string; meeting_id?: number }) => void;
  title: string;
  setTitle: (title: string) => void;
  assignedTo: string;
  setAssignedTo: (userId: string) => void;
  dueDate?: Date;
  setDueDate: (date?: Date) => void;
}

export const RockForm = ({ 
  users, 
  onSubmit, 
  title, 
  setTitle, 
  assignedTo, 
  setAssignedTo, 
  dueDate, 
  setDueDate 
}: RockFormProps) => {
  const handleSubmit = () => {
    if (!title.trim()) return;
    
    onSubmit({
      title,
      owner_id: assignedTo,
      due_date: dueDate?.toISOString(),
    });
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Add new rock..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Select value={assignedTo} onValueChange={setAssignedTo}>
        <SelectTrigger>
          <SelectValue placeholder="Assign to..." />
        </SelectTrigger>
        <SelectContent>
          {users?.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.username}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dueDate ? format(dueDate, 'PPP') : 'Pick a due date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dueDate}
            onSelect={setDueDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button onClick={handleSubmit} className="w-full">Add Rock</Button>
    </div>
  );
};