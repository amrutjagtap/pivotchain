import React, { useState, useEffect } from "react";
import { Form, Button, Table, Badge } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Loader from "./CommonComponents/Loader";
import { Api } from "./Utils/Api";
import {
  createNewCustomerAPI,
  getAllCustomersAPI,
  deleteCustByIdAPI,
  updateCustomerAPI,
} from "./Api/Links";

import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
// import './App.css';

const App = () => {
  const [show, setShow] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [modalTitle, setModalTitle] = useState("Create Customer");
  const [custId, setCustId] = useState(null);

  // Customer Data
  const [custData, setCustData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // State to store form field values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    status: "active",
  });

  // State to store form validation errors
  const [errors, setErrors] = useState({});

  // Form field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Form submission handler
  const handleSubmit = (e) => {
    setLoaderStatus(true);
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Submit the form data to the server or perform other actions
      console.log("Form submitted:", formData);
      Api("post", createNewCustomerAPI, formData)
        .then((res) => {
          if (res.data === "SAVED") {
            getAllCustData();
            setLoaderStatus(false);
            toast.success("Customer Created Sucessfully");
            setShow(false);
            clearForm();
          } else if (res.data === "EXIST") {
            setLoaderStatus(false);
            toast.warn("Customer already exist");
          }
        })
        .catch((err) => {
          setLoaderStatus(false);
          toast.error("Customer creation failed.");
          console.log("====================================");
          console.log("Error=-=" + err);
          console.log("====================================");
        });
    } else {
      setErrors(validationErrors);
    }
  };

  const handleUpdate = (e) => {
    setLoaderStatus(true);
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Submit the form data to the server or perform other actions
      console.log("Form submitted:", formData);
      Api("put", updateCustomerAPI + custId, formData)
        .then((res) => {
          if (res.data === "UPDATED") {
            getAllCustData();
            setLoaderStatus(false);
            toast.success("Customer Updated Sucessfully");
            setShow(false);
            clearForm();
          } else if (res.data === "EXIST") {
            setLoaderStatus(false);
            toast.warn("Your email id is already exists");
          }
        })
        .catch((err) => {
          setLoaderStatus(false);
          toast.error("Customer updation failed.");
          console.log("====================================");
          console.log("Error=-=" + err);
          console.log("====================================");
        });
    } else {
      setErrors(validationErrors);
    }
  };

  // Form validation function
  const validateForm = () => {
    const errors = {};
    if (!formData.name) {
      errors.name = "Name is required";
      setLoaderStatus(false);
    }
    if (!formData.email) {
      errors.email = "Email is required";
      setLoaderStatus(false);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email address";
      setLoaderStatus(false);
    }
    if (!formData.contact) {
      errors.contact = "Mobile number is required";
      setLoaderStatus(false);
    } else if (!/^[6-9]\d{9}$/.test(formData.contact)) {
      errors.contact = "Invalid mobile number";
      setLoaderStatus(false);
    }
    if (!formData.address) {
      errors.address = "Address is required";
      setLoaderStatus(false);
    }
    setLoaderStatus(false);
    return errors;
  };

  const clearForm = () => {
    setCustId(null);
    setModalTitle("Create Customer");
    setFormData({
      name: "",
      email: "",
      contact: "",
      address: "",
      status: "active",
    });
  };

  const getAllCustData = () => {
    setLoaderStatus(true);
    Api("get", getAllCustomersAPI, null)
      .then((res) => {
        if (res.data !== null) {
          setCustData(res.data);
          setFilteredData(res.data);
          setLoaderStatus(false);
        }
      })
      .catch((err) => {
        setLoaderStatus(false);
        console.log("====================================");
        console.log("Error=-" + err);
        console.log("====================================");
      });
  };

  useEffect(() => {
    getAllCustData();
  }, []);

  // Set values to form fields
  const handleEdit = (data) => {
    setModalTitle("Update Customer Details");
    setCustId(data._id);
    setFormData({
      name: data.name,
      email: data.email,
      contact: data.contact,
      address: data.address,
      status: data.status,
    });
    setShow(true);
  };

  const deleteCustomer = () => {
    setLoaderStatus(true);
    Api("delete", deleteCustByIdAPI + custId, null)
      .then((res) => {
        if (res.data === "DELETED") {
          setLoaderStatus(false);
          setDeleteModal(false);
          toast.success("Customer deleted sucessfully");
          getAllCustData();
        }
      })
      .catch((err) => {
        setLoaderStatus(false);
        clearForm();
        setDeleteModal(false);
        toast.error("Error occured, Something went wrong.");
        console.log("====================================");
        console.log("Error=-" + err);
        console.log("====================================");
      });
  };

  useEffect(() => {
    setFilteredData(
      custData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item._id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <>
      {loaderStatus === true ? <Loader /> : null}
      <ToastContainer />

      <div className="container-fluid">
        <div className="row text-center bg-primary text-light">
          <h3>Customer Management</h3>
        </div>
      </div>

      <div className="container">
        {/* CARDS */}
        <div className="row">
          <div className="col-sm-12 col-md-4 card-wrapper">
            <div className="card-all">
              <strong>All Customers</strong>
              <h3>{custData.length}</h3>
            </div>
          </div>
          <div className="col-sm-12 col-md-4 card-wrapper">
            <div className="card-active">
              <strong>Active Customers</strong>
              <h3>
                {custData.filter((item) => item.status === "active").length}
              </h3>
            </div>
          </div>
          <div className="col-sm-12 col-md-4 card-wrapper">
            <div className="card-inactive">
              <strong>Inactive Customers</strong>
              <h3>
                {custData.filter((item) => item.status === "inactive").length}
              </h3>
            </div>
          </div>
        </div>

        <div className="row">
          <h4>Customer List</h4>
          <hr />
          <div className="col-sm-3 mb-3">
            <button className="btn btn-primary" onClick={() => setShow(true)}>
              New Customer
            </button>
          </div>
          <div className="col-sm-3 offset-sm-6">
            <input
              className="form-control"
              type="text"
              placeholder="Search Here"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </div>
          <Table bordered hover responsive="sm">
            <thead>
              <tr className="table-bgdark">
                <th>Id</th>
                <th>Customer Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Address</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                return (
                  <tr key={item._id}>
                    <td>{parseInt(index) + 1}</td>
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.contact}</td>
                    <td>{item.address}</td>
                    <td>
                      {item.status === "active" ? (
                        <Badge bg="success">ACTIVE</Badge>
                      ) : (
                        <Badge bg="danger">IN-ACTIVE</Badge>
                      )}
                    </td>
                    <td>{moment(item.createdDate).format("DD-MM-YYYY")}</td>
                    <td>
                      <FaEdit
                        className="text-success mx-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEdit(item)}
                      />
                      <FaTrashCan
                        className="text-danger mx-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          setCustId(item._id);
                          setDeleteModal(item);
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>

      {/* Create Customer Modal */}

      <Modal
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
      >
        <Form onSubmit={custId === null ? handleSubmit : handleUpdate}>
          <Modal.Header closeButton>
            <Modal.Title>{modalTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="name">
              <Form.Label className="fw-bold">Name:</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label className="fw-bold">Email:</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="contact">
              <Form.Label className="fw-bold">Contact:</Form.Label>
              <Form.Control
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                isInvalid={!!errors.contact}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contact}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="address">
              <Form.Label className="fw-bold">Address:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="address"
                value={formData.address}
                onChange={handleChange}
                isInvalid={!!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="status" className="mb-3">
              <Form.Label className="fw-bold">Status:</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                clearForm();
                setShow(false);
              }}
            >
              Close
            </Button>
            <Button
              type="submit"
              variant={custId === null ? "primary" : "warning"}
            >
              {custId === null ? "SAVE" : "UPDATE"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        show={deleteModal}
        onHide={() => setDeleteModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Form>
          <Modal.Body>
            <h3 className="text-center my-3">
              Are you sure you want to delete ?
            </h3>
            <div
              style={{
                alignItems: "center",
                display: "flex",
                justifyContent: "center",
                margin: "26px 0",
              }}
            >
              <span
                style={{
                  padding: 10,
                  backgroundColor: "#DAFFD9",
                  borderRadius: 20,
                  color: "#0AAE06",
                  border: "1px solid #7DFF7A",
                  cursor: "pointer",
                }}
                onClick={deleteCustomer}
              >
                Yes
              </span>
              <span
                style={{
                  padding: 10,
                  backgroundColor: "#FFD2D2",
                  borderRadius: 20,
                  color: "#C90A0A",
                  border: "1px solid #FF7575",
                  cursor: "pointer",
                  marginLeft: 12,
                }}
                onClick={() => {
                  setCustId(null);
                  setDeleteModal(false);
                }}
              >
                No
              </span>
            </div>
          </Modal.Body>
        </Form>
      </Modal>
    </>
  );
};

export default App;
