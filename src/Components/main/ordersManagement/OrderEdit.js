import React, { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { API, orderAPI } from "../../../API";
import { isAutheticated } from "../../auth/authhelper";
import Footer from "../Footer";
import axios from "axios";
import swal from "sweetalert";
import ClipLoader from "react-spinners/ClipLoader";
// import OrderDetail from "./OrderDetail";
import getSymbolFromCurrency from "currency-symbol-map";

const OrderEdit = () => {
  const history = useHistory();
  const { token } = isAutheticated();
  const { status, id } = useParams();
  const [productData, setProductData] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const [newStatus, setNewStatus] = useState("");
  const [currency, setCurrency] = useState();

  useEffect(() => {
    async function fetchData() {
      await axios
        .get(`${API}/api/user`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        })
        .then((res) => {
          setCurrency(res.data.data.settings.currency);

        })
        .catch((error) => {
          console.log(error);
        });
    }

    fetchData();
  }, [token]);



  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`${orderAPI}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const orderData = res.data.data.find((data) => {
            return data._id === id
          })

          setData(orderData);
          console.log(orderData);
        });
    };

    fetchData();
  }, [token]);



  const saveHandler = () => {
    setIsLoading(true);
    let newData = {
      is_completed: false,
      is_new: false,
      is_processing: false,
      is_delivered: false,
      is_returned: false,
      is_cancelled: false,
      is_dispatched: false,
      id: id,
    };

    switch (newStatus) {
      case "new":
        newData.is_new = true;
        break;
      case "processing":
        newData.is_processing = true;
        break;
      case "delivered":
        newData.is_delivered = true;
        break;
      case "dispatched":
        newData.is_dispatched = true;
        break;
      case "cancelled":
        newData.is_cancelled = true;
        break;
      case "returned":
        newData.is_returned = true;
        break;
      default:
        console.log("Wrong Status");
    }

    axios
      .patch(`${API}/api/user/update_order`, newData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        console.log(res);
        const done = await swal({
          title: "Saved Successfully!",
          icon: "success",
          buttons: {
            Done: {
              text: "Done",
              value: "Done",
            },
          },
        });
        setIsLoading(false);
        history.push(`/orders/${newStatus}/${id}`);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <h4 className="mb-0"> Order Details</h4>
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard">Shoperola</Link>
                    </li>
                    <li className="breadcrumb-item active">Orders</li>
                    <li className="breadcrumb-item active">
                      Order Details
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              {/* <div className="form-group text-right"> */}
              {/* <button
                  type="button"
                  className="btn btn-success btn-login waves-effect waves-light mr-3"
                  onClick={saveHandler}
                >
                  <ClipLoader loading={isLoading} size={18} />
                  {!isLoading && "Save"}
                </button>
                <Link to={`/orders/${status}`}>
                  <button
                    type="button"
                    className="btn btn-success btn-cancel waves-effect waves-light mr-3"
                  >
                    Cancel
                  </button>
                </Link> */}

              <div className="orderDetails">
                <div className="orderDetails-heading">
                  <li>User ID</li>
                  <li>Merchant Txn ID </li>
                  <li>Transaction ID</li>

                  <li>Created At</li>
                  <li>Updated At</li>
                  <li>Status</li>
                  <li>Amount</li>
                  <li>Checksum</li>
                </div>
                <div className="orderDetails-value">
                  <li>{data.userID}</li>
                  <li>{data.merchantTxnId}</li>
                  <li>{data.txnId}</li>

                  <li> {new Date(data.createdAt)
                    .toDateString(data.createdAt)
                    .split(" ")
                    .slice(1)
                    .join(" ")} {new Date(data.createdAt)
                      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }</li>
                  <li> {new Date(data.updatedAt)
                    .toDateString(data.updatedAt)
                    .split(" ")
                    .slice(1)
                    .join(" ")} {new Date(data.updatedAt)
                      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }</li>
                  <li>{data.status}</li>
                  <li> {getSymbolFromCurrency(currency)}{data.amount}</li>
                  <li>{data.checksum}</li>
                </div>
              </div>

              {/* <tr>
                
              </tr>

              <tr>
                
              </tr> */}


              {/* </div> */}
            </div>
          </div>
          {/* {data && currency && (
            <OrderDetail
              status={status}
              data={data}
              newStatus={newStatus}
              setNewStatus={setNewStatus}
              currency={currency}
            />
          )} */}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderEdit;
