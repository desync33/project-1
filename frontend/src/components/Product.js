import axios from 'axios';
import React, { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { Store } from '../Store';
import Rating from './Rating';

function Product({ product }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async () => {
    try {
      const existItem = cartItems.find((item) => item._id === product._id);
      const quantity = existItem ? existItem.quantity + 1 : 1;

      // Correct API endpoint for MySQL
      const { data } = await axios.get(`/api/products/${product.id}`); // Use `product.id` if you're using MySQL
      if (data.countInStock < quantity) {
        window.alert('Sorry, the product is out of stock');
        return;
      }

      ctxDispatch({
        type: 'CART_ADD_ITEM',
        payload: { ...product, quantity },
      });
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      window.alert('Failed to add product to cart');
    }
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of stock
          </Button>
        ) : (
          <Button onClick={addToCartHandler}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
