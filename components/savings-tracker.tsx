"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, GripVertical, Pin, PinOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

type SavingsGoal = {
  id: number;
  name: string;
  target: number;
  current: number;
  deadline: string;
  isPinned: boolean;
  order: number;
};

const mockGoals: SavingsGoal[] = [
  {
    id: 1,
    name: "Emergency Fund",
    target: 25000,
    current: 12500,
    deadline: "2024-12-31",
    isPinned: false,
    order: 0,
  },
  {
    id: 2,
    name: "New Car",
    target: 35000,
    current: 5000,
    deadline: "2025-06-30",
    isPinned: false,
    order: 1,
  },
];

export default function SavingsTracker() {
  const [goals, setGoals] = useState(mockGoals);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  const handleAddGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newGoal = {
      id: goals.length + 1,
      name: formData.get("name") as string,
      target: Number(formData.get("target")),
      current: Number(formData.get("current")),
      deadline: formData.get("deadline") as string,
      isPinned: false,
      order: goals.length,
    };
    setGoals([...goals, newGoal]);
    setIsAddOpen(false);
  };

  const handleEditGoal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedGoal) return;

    const formData = new FormData(e.currentTarget);
    const updatedGoal = {
      ...selectedGoal,
      name: formData.get("name") as string,
      target: Number(formData.get("target")),
      current: Number(formData.get("current")),
      deadline: formData.get("deadline") as string,
    };

    setGoals(goals.map((goal) => 
      goal.id === selectedGoal.id ? updatedGoal : goal
    ));
    setIsEditOpen(false);
    setSelectedGoal(null);
  };

  const openEditDialog = (goal: SavingsGoal) => {
    setSelectedGoal(goal);
    setIsEditOpen(true);
  };

  const togglePin = (id: number) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        return { ...goal, isPinned: !goal.isPinned };
      }
      return goal;
    }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(goals);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setGoals(updatedItems);
  };

  // Sort goals: pinned first, then by order
  const sortedGoals = [...goals].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return a.order - b.order;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Your Goals</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Savings Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target Amount ($)</Label>
                <Input
                  id="target"
                  name="target"
                  type="number"
                  min="0"
                  step="100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current">Current Amount ($)</Label>
                <Input
                  id="current"
                  name="current"
                  type="number"
                  min="0"
                  step="100"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Target Date</Label>
                <Input id="deadline" name="deadline" type="date" required />
              </div>
              <Button type="submit" className="w-full">
                Create Goal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="goals">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {sortedGoals.map((goal, index) => (
                <Draggable
                  key={goal.id}
                  draggableId={goal.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <Card className={`p-4 ${goal.isPinned ? 'border-primary' : ''}`}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            </div>
                            <div>
                              <h3 className="font-medium">{goal.name}</h3>
                              <span className="text-sm text-muted-foreground">
                                Due {new Date(goal.deadline).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => togglePin(goal.id)}
                            >
                              {goal.isPinned ? (
                                <PinOff className="h-4 w-4" />
                              ) : (
                                <Pin className="h-4 w-4" />
                              )}
                            </Button>
                            <Dialog 
                              open={isEditOpen && selectedGoal?.id === goal.id} 
                              onOpenChange={(open) => {
                                setIsEditOpen(open);
                                if (!open) setSelectedGoal(null);
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => openEditDialog(goal)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Savings Goal</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleEditGoal} className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-name">Goal Name</Label>
                                    <Input 
                                      id="edit-name" 
                                      name="name" 
                                      defaultValue={goal.name}
                                      required 
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-target">Target Amount ($)</Label>
                                    <Input
                                      id="edit-target"
                                      name="target"
                                      type="number"
                                      min="0"
                                      step="100"
                                      defaultValue={goal.target}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-current">Current Amount ($)</Label>
                                    <Input
                                      id="edit-current"
                                      name="current"
                                      type="number"
                                      min="0"
                                      step="100"
                                      defaultValue={goal.current}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-deadline">Target Date</Label>
                                    <Input 
                                      id="edit-deadline" 
                                      name="deadline" 
                                      type="date"
                                      defaultValue={goal.deadline}
                                      required 
                                    />
                                  </div>
                                  <Button type="submit" className="w-full">
                                    Save Changes
                                  </Button>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                        <Progress
                          value={(goal.current / goal.target) * 100}
                          className="h-2 mb-2"
                        />
                        <div className="flex justify-between text-sm">
                          <span>${goal.current.toLocaleString()}</span>
                          <span className="text-muted-foreground">
                            ${goal.target.toLocaleString()}
                          </span>
                        </div>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}