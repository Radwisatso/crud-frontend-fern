import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import TodoCard from "../components/TodoCard";

function Home() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [status, setStatus] = useState("OPEN");
  let navigate = useNavigate();

  async function fetchTodos() {
    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "GET",
      });
      const result = await response.json();
      console.log(result);
      setTodos(result);
    } catch (error) {
      console.log(error);
    }
  }

  async function createTodo(event) {
    event.preventDefault();
    const newTodo = {
      id: String(+todos.at(-1).id + 1) ?? "1",
      task: task,
      status: status,
    };
    await fetch("http://localhost:3000/todos", {
      method: "POST",
      body: JSON.stringify(newTodo),
    });

    setTodos([...todos, newTodo]);
  }

  async function deleteTodo(id) {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "GET",
      });
      const foundTodo = await response.json();
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          fetch(`http://localhost:3000/todos/${foundTodo.id}`, {
            method: "DELETE",
          });
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: `Successfully delete todo with id ${foundTodo.id}`,
          });
          fetchTodos();
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to delete todo",
      });
    }
  }

  function editTodo(id) {
    navigate(`/${id}`);
  }

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <div className="flex w-full">
        <div className="card bg-base-300 rounded-box grid grow place-items-center">
          {/* FORM CREATE */}
          <form onSubmit={createTodo} action="" className="flex flex-col gap-3">
            <h1>Create Todo</h1>
            <label className="input">
              <span className="label">Task</span>
              <input
                onChange={(e) => setTask(e.target.value)}
                value={task}
                type="text"
                placeholder="Type your task here..."
              />
            </label>
            <label className="select">
              <span className="label">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="OPEN">OPEN</option>
                <option value="ONGOING">ONGOING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </label>
            <button className="btn btn-primary">Submit</button>
          </form>
          {/* FORM CREATE END */}
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="card bg-base-300 rounded-box grid grow place-items-center p-3">
          <div className="flex flex-wrap gap-10 max-w-[1080px]">
            {todos.map((t) => (
              <TodoCard
                key={t.id}
                task={t.task}
                status={t.status}
                onDelete={() => deleteTodo(t.id)}
                onEdit={() => editTodo(t.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
