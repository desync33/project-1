import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Button, Card, Col, Form, ListGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Store } from '../Store';
import MessageBox from '../components/MessageBox';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  const [showForm, setShowForm] = useState(false);

  // Handle updating the quantity of a product
  const updateQuantityHandler = (productId, quantity) => {
    dispatch({
      type: 'CART_UPDATE_ITEM',
      payload: { productId, quantity },
    });
  };

  // Handle removing a product from the cart
  const removeFromCartHandler = (productId) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: productId });
  };

  // Handle updating the shipping address
  const handleShippingChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const checkoutHandler = async () => {
    if (
      !shippingAddress.fullName ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      window.alert('All fields in the shipping address form are required.');
      return;
    }

    const orderData = {
      totalPrice: cartItems.reduce((a, c) => a + c.price * c.quantity, 0),
      shippingAddress,
      products: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      userId: userInfo.id,
    };

    try {
      await axios.post('/api/orders', orderData);
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      toast.success('Order placed successfully!');
      setTimeout(() => {
        navigate('/');
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error(
        'Error creating order:',
        error.response?.data?.message || error.message
      );
      toast.error('Failed to create order. Please try again.');
    }
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.id}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="img-fluid rounded img-thumbnail"
                      />
                      <Link to={`/product/${item.slug}`}>{item.name}</Link>
                    </Col>
                    <Col md={3}>
                      <Button
                        variant="light"
                        disabled={item.quantity === 1}
                        onClick={() =>
                          updateQuantityHandler(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>{' '}
                      <span>{item.quantity}</span>{' '}
                      <Button
                        variant="light"
                        onClick={() =>
                          updateQuantityHandler(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </Col>
                    <Col md={3}>${item.price}</Col>
                    <Col md={2}>
                      <Button
                        variant="light"
                        onClick={() => removeFromCartHandler(item.id)}
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items): $
                    {cartItems
                      .reduce((a, c) => a + c.price * c.quantity, 0)
                      .toFixed(2)}
                  </h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  {!showForm ? (
                    <Button
                      type="button"
                      onClick={() => setShowForm(true)}
                      className="btn-block"
                    >
                      Enter Shipping Address
                    </Button>
                  ) : (
                    <Form>
                      <Form.Group className="mb-3" controlId="fullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={shippingAddress.fullName}
                          onChange={handleShippingChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={shippingAddress.address}
                          onChange={handleShippingChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleShippingChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="postalCode">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="postalCode"
                          value={shippingAddress.postalCode}
                          onChange={handleShippingChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="country">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          type="text"
                          name="country"
                          value={shippingAddress.country}
                          onChange={handleShippingChange}
                          required
                        />
                      </Form.Group>
                    </Form>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    variant="primary"
                    className="btn-block"
                    onClick={checkoutHandler}
                    disabled={cartItems.length === 0 || !showForm}
                  >
                    Proceed to Checkout
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
