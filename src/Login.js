import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useEffect, useState } from "react";

function Dashboard() {
  const [users, setUser] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editUser, setEditUser] = useState({});
  let fetchData = async () => {
    try {
      let res = await axios.get(
        "https://node-express-demo-deployment.herokuapp.com/students"
      );
      setUser(res.data).catch((err) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(); // this will fetch all apis to this above mentioned server
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      paasword: "",
    },
    onSubmit: async (values) => {
      try {
        if (!isEdit) {
          await axios.post(
            "https://node-express-demo-deployment.herokuapp.com/student",
            values
          );
          fetchData();
        } else {
          delete values._id;
          await axios.put(
            `https://node-express-demo-deployment.herokuapp.com/student/${editUser._id}`,
            values
          );
          setIsEdit(false);
          fetchData();
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  let handleEdit = async (id) => {
    try {
      let student = await axios.get(
        `https://node-express-demo-deployment.herokuapp.com/student/${id}`
      );
      formik.setValues(student.data);
      setEditUser(student.data);
    } catch (error) {
      console.log(error);
    }
  };
  let handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://node-express-demo-deployment.herokuapp.com/student/${id}`
      );
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <form onSubmit={formik.handleSubmit}>
              <div className="col-lg-12">
                <label>Email</label>
                <input
                  type="text"
                  placeholder="Search"
                  className="form-control"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="col-lg-12">
                <label>Password</label>
                <input
                  type="text"
                  placeholder="Password"
                  className="form-control"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="col-lg-12 mt-2">
                <input
                  className="btn btn-primary"
                  type="submit"
                  value="Submit"
                />
              </div>
            </form>
          </div>
          <div className="col-lg-6">
            <table class="table">
              <thead class="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Username</th>
                  <th scope="col">Password</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  return (
                    <tr>
                      <th scope="row">{user._id}</th>
                      <td>{user.email}</td>
                      <td>{user.password}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEdit(user._id)}
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
export default Dashboard;
