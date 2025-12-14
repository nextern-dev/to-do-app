"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/Header";

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

import { IoMdMoon } from "react-icons/io";
import { MdSunny } from "react-icons/md";
import {
  CheckCircle2,
  Circle,
  Edit3,
  Trash2,
  Plus,
  Calendar,
  Trash,
  Edit,
  Edit2,
} from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  useEffect(() => {
    if (session) {
      fetchTodos();
    }
  }, [session]);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const createTodo = async () => {
    if (!newTodo.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTodo,
          description: newDescription,
        }),
      });

      if (response.ok) {
        const todo = await response.json();
        setTodos([todo, ...todos]);
        setNewTodo("");
        setNewDescription("");
      }
    } catch (error) {
      console.error("Error creating todo:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
        setEditingTodo(null);
      }
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingTodo(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
  };

  const saveEdit = () => {
    if (editingTodo) {
      updateTodo(editingTodo, {
        title: editTitle,
        description: editDescription,
      });
    }
  };

  const openDeleteDialog = (todo: Todo) => {
    setTodoToDelete(todo);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTodoToDelete(null);
  };

  const confirmDelete = async () => {
    if (todoToDelete) {
      await deleteTodo(todoToDelete.id);
      closeDeleteDialog();
      toast.success("Todo deleted successfully");
    }
  };

  const registerUser = async () => {
    if (
      !registerName.trim() ||
      !registerEmail.trim() ||
      !registerPassword.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setRegisterLoading(true);
    try {
      console.log("Registering user:", {
        name: registerName,
        email: registerEmail,
      });
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });

      console.log("Registration response status:", response.status);

      if (response.ok) {
        toast.success("User registered successfully! You can now sign in.");
        setShowRegister(false);
        setRegisterName("");
        setRegisterEmail("");
        setRegisterPassword("");
      } else {
        const errorData = await response.json();
        console.error("Registration error:", errorData);
        toast.error(errorData.error || "Registration failed");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast.error("Registration failed - network error");
    } finally {
      setRegisterLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-3xl">Todo App</CardTitle>
          </CardHeader>
          <CardContent>
            {showRegister ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Register</h2>
                <Input
                  type="text"
                  placeholder="Name"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  autoComplete="name"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  autoComplete="username"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <div className="flex space-x-2">
                  <Button
                    onClick={registerUser}
                    disabled={registerLoading}
                    className="flex-1"
                  >
                    {registerLoading ? "Registering..." : "Register"}
                  </Button>
                  <Button
                    onClick={() => setShowRegister(false)}
                    variant="outline"
                    className="flex-1"
                    disabled={registerLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Sign In</h2>
                <Input
                  type="email"
                  placeholder="Email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  autoComplete="username"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  autoComplete="current-password"
                />

                <Button
                  onClick={() =>
                    signIn("credentials", {
                      email: signInEmail,
                      password: signInPassword,
                      callbackUrl: "/",
                    }).catch((error) => {
                      toast.error(
                        "Sign in failed: " +
                          (error?.message || "Invalid credentials")
                      );
                    })
                  }
                  className="w-full"
                >
                  Sign In with Credentials
                </Button>
                <Button
                  onClick={() => signIn("google", { callbackUrl: "/" })}
                  variant="secondary"
                  className="w-full"
                >
                  Sign In with Google
                </Button>
                <Button
                  onClick={() => setShowRegister(true)}
                  variant="link"
                  className="w-full"
                >
                  Don't have an account? Register
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header session={session} signOut={signOut} />

        {/* Add Todo Form */}
        <Card className="mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Plus className="h-5 w-5" />
              Add New Todo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="What needs to be done?"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && createTodo()}
                className="text-base"
              />
              <Textarea
                placeholder="Add a description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <Button
                onClick={createTodo}
                disabled={loading || !newTodo.trim()}
                className="w-full h-11"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Todo
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todos List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Your Todos ({todos.length})
          </h2>

          {todos.length === 0 ? (
            <Card className="p-12 text-center shadow-sm">
              <div className="flex flex-col items-center space-y-3">
                <Circle className="h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground text-lg">
                  No todos yet. Add one above!
                </p>
              </div>
            </Card>
          ) : (
            todos.map((todo, index) => (
              <Card
                key={todo.id}
                className={`shadow-sm hover:shadow-md transition-all duration-300 animate-slide-in-up ${
                  todo.completed ? "opacity-75 bg-muted/30" : "hover:bg-card/80"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-5">
                  {editingTodo === todo.id ? (
                    <div className="space-y-4">
                      <Input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-base"
                      />
                      <Textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <div className="flex space-x-2">
                        <Button onClick={saveEdit} size="sm">
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingTodo(null)}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() =>
                          updateTodo(todo.id, {
                            title: todo.title,
                            description: todo.description,
                            completed: !todo.completed,
                          })
                        }
                        className="mt-1 hover:scale-110 transition-transform duration-200"
                      >
                        {todo.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-medium text-base leading-relaxed ${
                            todo.completed
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p
                            className={`text-sm text-muted-foreground mt-2 leading-relaxed ${
                              todo.completed ? "line-through" : ""
                            }`}
                          >
                            {todo.description}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(todo.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          onClick={() => startEditing(todo)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Edit2 />
                        </Button>
                        <Button
                          onClick={() => openDeleteDialog(todo)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Todo</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this todo? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {todoToDelete && (
              <div className="py-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium text-sm mb-2">{todoToDelete.title}</h4>
                  {todoToDelete.description && (
                    <p className="text-sm text-muted-foreground">
                      {todoToDelete.description}
                    </p>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={closeDeleteDialog}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete Todo
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
