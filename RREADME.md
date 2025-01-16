1. Create .env File

- duplicate .env.example in backend folder and rename it to .env

2. Run Backend
$ cd backend
$ npm install
$ npm start


3. Run Frontend
# open new terminal
$ cd frontend
$ npm install
$ npm start


what to do?

1. Install Tools
2. Create React App
3. Create Git Repository
4. List Products
   1. create products array
   2. add product images
   3. render products
   4. style products
5. Add page routing
   1. npm i react-router-dom
   2. create route for home screen
   3. create router for product screen
6. Create Node.JS Server
   1. run npm init in root folder
   2. Update package.json set type: module
   3. Add .js to imports
   4. npm install express
   5. create server.js
   6. add start command as node backend/server.js
   7. require express
   8. create route for / return backend is ready.
   9. move products.js from frontend to backend
   10. create route for /api/products
   11. return products
   12. run npm start
7. Fetch Products From Backend
   1. set proxy in package.json
   2. npm install axios
   3. use state hook
   4. use effect hook
   5. use reducer hook
8. Add bootstrap UI Framework
    1. npm install react-bootstrap bootstrap
    2. update App.js
9. Create Product and Rating Component
    1. create Rating component
    2. Create Product component
    3. Use Rating component in Product component
10. Create Product Details Screen
    1. fetch product from backend
    2. create 3 columns for image, info and action
11. Create Loading and Message Component
    1. create loading component
    2. use spinner component
    3. craete message component
    4. create utils.js to define getError fuction
12. Create React Context For Add Item To Cart
    1. Create React Context
    2. define reducer
    3. create store provider
    4. implement add to cart button click handler
13. Complete Add To Cart
    1. check exist item in the cart
    2. check count in stock in backend
14. Create Cart Screen
    1. create 2 columns
    2. display items list
    3. create action column
15. Complete Cart Screen
    1. click handler for inc/dec item
    2. click handler for remove item
    3. click handler for checkout
16. Create Signin Screen
    1. create sign in form
    2. add email and password
    3. add signin button
17. Connect To mysql Database
18. Seed Sample Products
    1. create Product model
    2. create seed route
    3. use route in server.js
    4. seed sample product
19. Seed Sample Users
    1. create user model
    2. seed sample users
20. Create Signin Backend API
    1. create signin api
    2. npm install jsonwebtoken
    3. define generateToken
21. Complete Signin Screen
    1. handle submit action
    2. save token in store and local storage
    3. show user name in header
22. Create Shipping Screen
    1. create form inputs
    2. handle save shipping address
    3. add checkout wizard bar
23. Create Sign Up Screen
    1. create input forms
    2. handle submit
    3. create backend api
24. create Admin Dashboard.
    1.create backend APi
    2.create Dashboard Screen
    3.List users for admin
    4.List orders for admin
    5.show revenue in dashboard
25. Delete Product
    1.show delete button
    2.implement backend api
    3.handle on click
26.List Orders
   1.create order list screen
   2.implement backend api
   3.fetch and display orders
27.add place order button
   1.handle click action
   2.implement backend api for deliver
28.Delete Order
   1.add delete button
   2.handle click action
   3.implement backend api for delete
29. Delete User
    1.add delete button
    2.handle click action
    3.implement backend api for delete
30.Publish To Heroku
video link :https://youtu.be/xLJmdozj7y0
