import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function TodoDetail() {
  const [todo, setTodo] = useState({});
  let { id } = useParams();
  let navigate = useNavigate();

  async function fetchTodoById(id) {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`);
      const foundTodo = await response.json();
      console.log(foundTodo);
      setTodo(foundTodo);
    } catch (error) {
      console.log(error);
    }
  }

  async function submitEditTodo(e) {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3000/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(todo),
      });
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Todo has been edited",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchTodoById(id);
  }, []);

  return (
    <form
      onSubmit={submitEditTodo}
      action=""
      className="flex flex-col gap-3 max-w-[300px]"
    >
      <h1>Edit Todo id: {id}</h1>
      <label className="input">
        <span className="label">Task</span>
        <input
          value={todo.task}
          onChange={(e) =>
            setTodo({
              ...todo,
              task: e.target.value,
            })
          }
          type="text"
          placeholder="Type your task here..."
        />
      </label>
      <label className="select">
        <span className="label">Status</span>
        <select
          value={todo.status}
          onChange={(e) =>
            setTodo({
              ...todo,
              status: e.target.value,
            })
          }
        >
          <option value="OPEN">OPEN</option>
          <option value="ONGOING">ONGOING</option>
          <option value="COMPLETED">COMPLETED</option>
        </select>
      </label>
      <button className="btn btn-primary">Submit</button>
    </form>
  );
}
