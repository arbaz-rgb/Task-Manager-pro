import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  User,
  LogOut,
  Check,
  X,
  Search,
  Filter,
  Download,
  Moon,
  Sun,
  Tag,
  MessageSquare,
  Activity,
  TrendingUp,
  CheckSquare,
} from "lucide-react";

const TaskManagerApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, username: "test1", password: "test123", role: "user" },
  ]);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Sample Task",
      description: "This is a sample task",
      dueDate: "2025-10-10",
      status: "pending",
      priority: "high",
      assignedTo: 1,
      createdBy: 1,
      category: "Work",
      comments: [],
    },
  ]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "pending",
    priority: "medium",
    assignedTo: 1,
    category: "Work",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [commentText, setCommentText] = useState("");
  const tasksPerPage = 5;
  const categories = ["Work", "Personal", "Shopping", "Health", "Other"];

  useEffect(() => {
    if (users.length > 0 && !taskForm.assignedTo) {
      setTaskForm((prev) => ({ ...prev, assignedTo: users[0].id }));
    }
  }, [users]);

  const handleLogin = () => {
    const user = users.find(
      (u) =>
        u.username === loginForm.username && u.password === loginForm.password
    );
    if (user) {
      setCurrentUser(user);
      setLoginForm({ username: "", password: "" });
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowTaskForm(false);
    setEditingTask(null);
    setViewingTask(null);
  };

  const handleAddUser = () => {
    if (!currentUser || currentUser.role !== "admin") {
      alert("Only admins can add users");
      return;
    }
    if (!newUser.username || !newUser.password) {
      alert("Please fill all fields");
      return;
    }
    const newId = Math.max(...users.map((u) => u.id), 0) + 1;
    setUsers([...users, { ...newUser, id: newId }]);
    setNewUser({ username: "", password: "", role: "user" });
    alert("User added successfully");
  };

  const handleRemoveUser = (userId) => {
    if (!currentUser || currentUser.role !== "admin") {
      alert("Only admins can remove users");
      return;
    }
    if (userId === currentUser.id) {
      alert("Cannot remove yourself");
      return;
    }
    setUsers(users.filter((u) => u.id !== userId));
    alert("User removed successfully");
  };

  const handleTaskSubmit = () => {
    if (!taskForm.title || !taskForm.description || !taskForm.dueDate) {
      alert("Please fill all required fields");
      return;
    }
    if (!currentUser) {
      alert("You must be logged in to perform this action");
      return;
    }
    if (editingTask) {
      setTasks(
        tasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskForm } : t))
      );
      setEditingTask(null);
    } else {
      const newTask = {
        ...taskForm,
        id: Math.max(...tasks.map((t) => t.id), 0) + 1,
        createdBy: currentUser.id,
        comments: [],
      };
      setTasks([...tasks, newTask]);
    }
    setShowTaskForm(false);
    setTaskForm({
      title: "",
      description: "",
      dueDate: "",
      status: "pending",
      priority: "medium",
      assignedTo: users[0]?.id || 1,
      category: "Work",
    });
  };

  const openEditForm = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo,
      category: task.category || "Work",
    });
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const openCreateForm = () => {
    setTaskForm({
      title: "",
      description: "",
      dueDate: "",
      status: "pending",
      priority: "medium",
      assignedTo: users[0]?.id || 1,
      category: "Work",
    });
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
    setDeleteConfirm(null);
    setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handlePriorityChange = (taskId, newPriority) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, priority: newPriority } : t))
    );
  };

  const handleAddComment = (taskId) => {
    if (!commentText.trim()) return;
    setTasks(
      tasks.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            comments: [
              ...(t.comments || []),
              {
                id: Date.now(),
                text: commentText,
                user: currentUser.username,
                date: new Date().toLocaleString(),
              },
            ],
          };
        }
        return t;
      })
    );
    setCommentText("");
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleBulkDelete = () => {
    if (selectedTasks.length === 0) {
      alert("No tasks selected");
      return;
    }
    if (window.confirm(`Delete ${selectedTasks.length} tasks?`)) {
      setTasks(tasks.filter((t) => !selectedTasks.includes(t.id)));
      setSelectedTasks([]);
    }
  };

  const handleBulkStatusChange = (newStatus) => {
    if (selectedTasks.length === 0) {
      alert("No tasks selected");
      return;
    }
    setTasks(
      tasks.map((t) =>
        selectedTasks.includes(t.id) ? { ...t, status: newStatus } : t
      )
    );
    setSelectedTasks([]);
  };

  const handleExportTasks = () => {
    const data = getFilteredTasks();
    const csv = [
      [
        "Title",
        "Description",
        "Due Date",
        "Status",
        "Priority",
        "Category",
        "Assigned To",
      ],
      ...data.map((t) => [
        t.title,
        t.description,
        t.dueDate,
        t.status,
        t.priority,
        t.category || "N/A",
        users.find((u) => u.id === t.assignedTo)?.username || "Unknown",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tasks_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    if (currentUser && currentUser.role !== "admin") {
      filtered = filtered.filter((t) => t.assignedTo === currentUser.id);
    }

    if (filterPriority !== "all") {
      filtered = filtered.filter((t) => t.priority === filterPriority);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((t) => t.status === filterStatus);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((t) => t.category === filterCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getPaginatedTasks = () => {
    const filtered = getFilteredTasks();
    const startIndex = (currentPage - 1) * tasksPerPage;
    return filtered.slice(startIndex, startIndex + tasksPerPage);
  };

  const getTaskStats = () => {
    const userTasks =
      currentUser?.role === "admin"
        ? tasks
        : tasks.filter((t) => t.assignedTo === currentUser?.id);
    return {
      total: userTasks.length,
      completed: userTasks.filter((t) => t.status === "completed").length,
      pending: userTasks.filter((t) => t.status === "pending").length,
      high: userTasks.filter(
        (t) => t.priority === "high" && t.status === "pending"
      ).length,
    };
  };

  const totalPages = Math.ceil(getFilteredTasks().length / tasksPerPage);

  const priorityColors = {
    low: darkMode
      ? "bg-green-900 border-green-600 text-green-200"
      : "bg-green-100 border-green-300 text-green-800",
    medium: darkMode
      ? "bg-yellow-900 border-yellow-600 text-yellow-200"
      : "bg-yellow-100 border-yellow-300 text-yellow-800",
    high: darkMode
      ? "bg-red-900 border-red-600 text-red-200"
      : "bg-red-100 border-red-300 text-red-800",
  };

  const categoryColors = {
    Work: "bg-blue-100 text-blue-800",
    Personal: "bg-purple-100 text-purple-800",
    Shopping: "bg-pink-100 text-pink-800",
    Health: "bg-green-100 text-green-800",
    Other: "bg-gray-100 text-gray-800",
  };

  if (!currentUser) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode
            ? "bg-gray-900"
            : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
        }`}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${
              darkMode
                ? "bg-gray-800 text-yellow-400"
                : "bg-white text-gray-700"
            } shadow-lg`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-2xl p-8 w-full max-w-md`}
        >
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                darkMode
                  ? "bg-blue-900"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              } mb-4`}
            >
              <CheckSquare size={32} className="text-white" />
            </div>
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-2`}
            >
              Task Manager Pro
            </h1>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Sign in to continue
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, username: e.target.value })
                }
                className={`w-full px-4 py-3 border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="Enter username"
              />
            </div>
            <div>
              <label
                className={`block text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mb-2`}
              >
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                className={`w-full px-4 py-3 border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                placeholder="Enter password"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all transform hover:scale-105 shadow-lg"
            >
              Sign In
            </button>
            <div
              className={`mt-6 p-4 ${
                darkMode ? "bg-gray-700" : "bg-gray-50"
              } rounded-lg`}
            >
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                } mb-2`}
              >
                Demo Credentials:
              </p>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                User: test1 / test123
              </p>
              {/* <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                User: 1 / user123
              </p> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = getTaskStats();

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      } p-4 md:p-8`}
    >
      <div className="max-w-7xl mx-auto">
        <div
          className={`${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
          } rounded-2xl shadow-xl p-6 mb-6 border`}
        >
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full ${
                  darkMode
                    ? "bg-blue-900"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600"
                }`}
              >
                <CheckSquare size={24} className="text-white" />
              </div>
              <div>
                <h1
                  className={`text-2xl md:text-3xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Task Manager Pro
                </h1>
                <p
                  className={`text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Manage your tasks efficiently
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowStats(!showStats)}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
                title="Toggle Stats"
              >
                <TrendingUp size={20} />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div
                className={`flex items-center gap-2 px-4 py-2 ${
                  darkMode ? "bg-gray-700" : "bg-gray-100"
                } rounded-lg`}
              >
                <User
                  size={20}
                  className={darkMode ? "text-gray-400" : "text-gray-600"}
                />
                <span
                  className={`font-medium ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {currentUser.username}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    currentUser.role === "admin"
                      ? "bg-purple-500"
                      : "bg-blue-500"
                  } text-white`}
                >
                  {currentUser.role}
                </span>
              </div>
              {currentUser.role === "admin" && (
                <button
                  onClick={() => setShowUserManagement(!showUserManagement)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md"
                >
                  Manage Users
                </button>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6 border-l-4 border-blue-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Total Tasks
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.total}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Activity size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6 border-l-4 border-green-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Completed
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.completed}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Check size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6 border-l-4 border-yellow-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    Pending
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.pending}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Calendar size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-xl shadow-lg p-6 border-l-4 border-red-500`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-1`}
                  >
                    High Priority
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stats.high}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <TrendingUp size={24} className="text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {showUserManagement && currentUser.role === "admin" && (
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } rounded-2xl shadow-xl p-6 mb-6`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                User Management
              </h2>
              <button
                onClick={() => setShowUserManagement(false)}
                className={`${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                } transition-colors`}
              >
                <X size={24} />
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div
                className={`${
                  darkMode ? "bg-gray-700" : "bg-gray-50"
                } rounded-lg p-4`}
              >
                <h3
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  Add New User
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Username"
                    value={newUser.username}
                    onChange={(e) =>
                      setNewUser({ ...newUser, username: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${
                      darkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "border-gray-300"
                    } rounded-lg`}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${
                      darkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "border-gray-300"
                    } rounded-lg`}
                  />
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${
                      darkMode
                        ? "bg-gray-600 border-gray-500 text-white"
                        : "border-gray-300"
                    } rounded-lg`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    onClick={handleAddUser}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Add User
                  </button>
                </div>
              </div>
              <div>
                <h3
                  className={`font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  All Users
                </h3>
                <div className="space-y-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className={`flex justify-between items-center ${
                        darkMode ? "bg-gray-700" : "bg-gray-50"
                      } rounded-lg p-3`}
                    >
                      <div>
                        <p
                          className={`font-medium ${
                            darkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {user.username}
                        </p>
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {user.role}
                        </p>
                      </div>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewingTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            >
              <div
                className={`sticky top-0 ${
                  darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
                } border-b p-6 flex justify-between items-center`}
              >
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Task Details
                </h2>
                <button
                  onClick={() => setViewingTask(null)}
                  className={`${
                    darkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Title
                  </label>
                  <p
                    className={`text-lg font-semibold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {viewingTask.title}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Description
                  </label>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {viewingTask.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Due Date
                    </label>
                    <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                      {viewingTask.dueDate}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Status
                    </label>
                    <p
                      className={`capitalize ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {viewingTask.status}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Priority
                    </label>
                    <p
                      className={`capitalize ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {viewingTask.priority}
                    </p>
                  </div>
                  <div>
                    <label
                      className={`text-sm font-medium ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Category
                    </label>
                    <p
                      className={`capitalize ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {viewingTask.category || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <label
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Assigned To
                  </label>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {users.find((u) => u.id === viewingTask.assignedTo)
                      ?.username || "Unknown"}
                  </p>
                </div>
                <div>
                  <label
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    } mb-2 block`}
                  >
                    Comments
                  </label>
                  <div className="space-y-2 mb-3">
                    {viewingTask.comments && viewingTask.comments.length > 0 ? (
                      viewingTask.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className={`${
                            darkMode ? "bg-gray-700" : "bg-gray-50"
                          } rounded-lg p-3`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span
                              className={`font-medium text-sm ${
                                darkMode ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {comment.user}
                            </span>
                            <span
                              className={`text-xs ${
                                darkMode ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {comment.date}
                            </span>
                          </div>
                          <p
                            className={`text-sm ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            {comment.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p
                        className={`text-sm ${
                          darkMode ? "text-gray-500" : "text-gray-400"
                        } italic`}
                      >
                        No comments yet
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className={`flex-1 px-4 py-2 border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300"
                      } rounded-lg`}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddComment(viewingTask.id)
                      }
                    />
                    <button
                      onClick={() => handleAddComment(viewingTask.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </div>
              </div>
              <div
                className={`sticky bottom-0 ${
                  darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
                } border-t p-6 flex gap-3`}
              >
                <button
                  onClick={() => {
                    openEditForm(viewingTask);
                    setViewingTask(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Edit2 size={18} />
                  Edit
                </button>
                <button
                  onClick={() => setViewingTask(null)}
                  className={`px-4 py-2 ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } ${
                    darkMode ? "text-white" : "text-gray-800"
                  } rounded-lg font-medium`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-2xl p-6 max-w-md w-full`}
            >
              <h2
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                Confirm Deletion
              </h2>
              <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleDeleteTask(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`flex-1 px-4 py-2 ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  } ${
                    darkMode ? "text-white" : "text-gray-800"
                  } rounded-lg font-medium`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showTaskForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
            >
              <div
                className={`sticky top-0 ${
                  darkMode ? "bg-gray-800 border-gray-700" : "bg-white"
                } border-b p-6 flex justify-between items-center`}
              >
                <h2
                  className={`text-2xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {editingTask ? "Edit Task" : "Create New Task"}
                </h2>
                <button
                  onClick={() => {
                    setShowTaskForm(false);
                    setEditingTask(null);
                  }}
                  className={`${
                    darkMode
                      ? "text-gray-400 hover:text-gray-300"
                      : "text-gray-500 hover:text-gray-700"
                  } transition-colors`}
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Title *
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, title: e.target.value })
                    }
                    className={`w-full px-4 py-2 border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter task title"
                  />
                </div>
                <div>
                  <label
                    className={`block text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } mb-2`}
                  >
                    Description *
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) =>
                      setTaskForm({ ...taskForm, description: e.target.value })
                    }
                    rows="4"
                    className={`w-full px-4 py-2 border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter task description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } mb-2`}
                    >
                      Due Date *
                    </label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, dueDate: e.target.value })
                      }
                      className={`w-full px-4 py-2 border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } mb-2`}
                    >
                      Priority
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, priority: e.target.value })
                      }
                      className={`w-full px-4 py-2 border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } mb-2`}
                    >
                      Category
                    </label>
                    <select
                      value={taskForm.category}
                      onChange={(e) =>
                        setTaskForm({ ...taskForm, category: e.target.value })
                      }
                      className={`w-full px-4 py-2 border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500`}
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  {editingTask && (
                    <div>
                      <label
                        className={`block text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        } mb-2`}
                      >
                        Status
                      </label>
                      <select
                        value={taskForm.status}
                        onChange={(e) =>
                          setTaskForm({ ...taskForm, status: e.target.value })
                        }
                        className={`w-full px-4 py-2 border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "border-gray-300"
                        } rounded-lg focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  )}
                  <div>
                    <label
                      className={`block text-sm font-medium ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } mb-2`}
                    >
                      Assign To
                    </label>
                    <select
                      value={taskForm.assignedTo}
                      onChange={(e) =>
                        setTaskForm({
                          ...taskForm,
                          assignedTo: parseInt(e.target.value),
                        })
                      }
                      className={`w-full px-4 py-2 border ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500`}
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleTaskSubmit}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    {editingTask ? "Update Task" : "Create Task"}
                  </button>
                  <button
                    onClick={() => {
                      setShowTaskForm(false);
                      setEditingTask(null);
                    }}
                    className={`px-4 py-2 ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-gray-200 hover:bg-gray-300"
                    } ${
                      darkMode ? "text-white" : "text-gray-800"
                    } rounded-lg font-medium`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`${
            darkMode ? "bg-gray-800" : "bg-white"
          } rounded-2xl shadow-xl p-6 mb-6`}
        >
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search tasks..."
                  className={`w-full pl-10 pr-4 py-2 border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
                <select
                  value={filterPriority}
                  onChange={(e) => {
                    setFilterPriority(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleExportTasks}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
              >
                <Download size={18} />
                Export
              </button>
              <button
                onClick={openCreateForm}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-md transform hover:scale-105"
              >
                <Plus size={20} />
                Create Task
              </button>
            </div>
          </div>

          {selectedTasks.length > 0 && (
            <div
              className={`${
                darkMode ? "bg-gray-700" : "bg-blue-50"
              } rounded-lg p-4 mb-4 flex items-center justify-between`}
            >
              <span
                className={`font-medium ${
                  darkMode ? "text-white" : "text-blue-900"
                }`}
              >
                {selectedTasks.length} task(s) selected
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkStatusChange("completed")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Mark Complete
                </button>
                <button
                  onClick={() => handleBulkStatusChange("pending")}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm font-medium"
                >
                  Mark Pending
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Delete All
                </button>
              </div>
            </div>
          )}

          <div>
            <h2
              className={`text-xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              } mb-4`}
            >
              {currentUser.role === "admin" ? "All Tasks" : "My Assigned Tasks"}
            </h2>
            {getPaginatedTasks().length === 0 ? (
              <div className="text-center py-12">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  } mb-4`}
                >
                  <Calendar
                    size={32}
                    className={darkMode ? "text-gray-400" : "text-gray-400"}
                  />
                </div>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  No tasks found
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {getPaginatedTasks().map((task) => (
                  <div
                    key={task.id}
                    className={`p-4 border-l-4 rounded-lg ${
                      priorityColors[task.priority]
                    } border transition-all hover:shadow-lg`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => toggleTaskSelection(task.id)}
                        className="mt-1 w-4 h-4 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3
                              className={`font-semibold text-lg ${
                                darkMode ? "text-gray-100" : "text-gray-900"
                              } mb-1`}
                            >
                              {task.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <span className="flex items-center gap-1">
                                <Calendar size={16} />
                                {task.dueDate}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  task.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {task.status}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  categoryColors[task.category] ||
                                  categoryColors.Other
                                }`}
                              >
                                <Tag size={12} className="inline mr-1" />
                                {task.category || "Other"}
                              </span>
                              {currentUser.role === "admin" && (
                                <span className="text-xs">
                                  👤{" "}
                                  {users.find((u) => u.id === task.assignedTo)
                                    ?.username || "Unknown"}
                                </span>
                              )}
                              {task.comments && task.comments.length > 0 && (
                                <span className="flex items-center gap-1 text-xs">
                                  <MessageSquare size={14} />
                                  {task.comments.length}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewingTask(task)}
                              className={`p-2 ${
                                darkMode
                                  ? "text-blue-400 hover:bg-gray-700"
                                  : "text-blue-600 hover:bg-blue-50"
                              } rounded transition-colors`}
                              title="View Details"
                            >
                              <Calendar size={18} />
                            </button>
                            <button
                              onClick={() => openEditForm(task)}
                              className={`p-2 ${
                                darkMode
                                  ? "text-blue-400 hover:bg-gray-700"
                                  : "text-blue-600 hover:bg-blue-50"
                              } rounded transition-colors`}
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(
                                  task.id,
                                  task.status === "pending"
                                    ? "completed"
                                    : "pending"
                                )
                              }
                              className={`p-2 rounded transition-colors ${
                                task.status === "completed"
                                  ? darkMode
                                    ? "text-gray-400 hover:bg-gray-700"
                                    : "text-gray-600 hover:bg-gray-50"
                                  : darkMode
                                  ? "text-green-400 hover:bg-gray-700"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                              title={
                                task.status === "completed"
                                  ? "Mark as Pending"
                                  : "Mark as Completed"
                              }
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(task.id)}
                              className={`p-2 ${
                                darkMode
                                  ? "text-red-400 hover:bg-gray-700"
                                  : "text-red-600 hover:bg-red-50"
                              } rounded transition-colors`}
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <span
                            className={`text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            } mr-2`}
                          >
                            Priority:
                          </span>
                          {["low", "medium", "high"].map((priority) => (
                            <button
                              key={priority}
                              onClick={() =>
                                handlePriorityChange(task.id, priority)
                              }
                              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                task.priority === priority
                                  ? priorityColors[priority]
                                  : darkMode
                                  ? "bg-gray-700 text-gray-400 hover:bg-gray-600"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}
                            >
                              {priority}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div
              className={`border-t ${
                darkMode ? "border-gray-700" : "border-gray-200"
              } mt-6 pt-4 flex justify-center items-center gap-2`}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                } rounded hover:${
                  darkMode ? "bg-gray-600" : "bg-gray-200"
                } disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium`}
              >
                Previous
              </button>
              <span
                className={`px-4 py-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } font-medium`}
              >
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                } rounded hover:${
                  darkMode ? "bg-gray-600" : "bg-gray-200"
                } disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManagerApp;
