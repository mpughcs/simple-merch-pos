import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, writeBatch } from "firebase/firestore";
import { db } from '../../FirebaseConfig';
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from 'react-router-dom'



const productRefs = {
    whiteShirts: doc(db, "products", "whiteShirts"),
    redShirts: doc(db, "products", "redShirts"),
    daisyShirts: doc(db, "products", "daisyShirts"),
    cds: doc(db, "products", "cds"),
};


const sizeOrder = ['S', 'M', 'L', 'XL', '2XL'];

const isDevelopmentMode = false; // Toggle this to false when deploying or for production use
const localProductData = [
    {
        "cost": 25,
        "name": "whiteShirts",
        "sizes": {
            "XL": 5,
            "S": 8,
            "L": 8,
            "M": 13
        },
        "image": "https://firebasestorage.googleapis.com/v0/b/merchsystem-f2359.appspot.com/o/whiteShirtPhoto.png?alt=media&token=4ae311f5-fb2e-416b-bfc1-27a4b3478fef",
        "id": "whiteShirts"
    },
    {
        "image": "https://firebasestorage.googleapis.com/v0/b/merchsystem-f2359.appspot.com/o/redShirtPhoto.png?alt=media&token=e3087bac-1684-400b-8bf9-be316a793b97",
        "cost": 25,
        "sizes": {
            "2XL": 6,
            "XL": 5,
            "S": 6,
            "M": 10,
            "L": 6
        },
        "name": "redShirts",
        "id": "redShirts"
    },
    {
        "cost": 25,
        "image": "https://firebasestorage.googleapis.com/v0/b/merchsystem-f2359.appspot.com/o/yellowShirtPhoto.png?alt=media&token=93991faa-3bb8-458c-b66e-5370fcabd317",
        "sizes": {
            "XL": 5,
            "L": 8,
            "M": 12,
            "S": 8
        },
        "name": "daisyShirts",
        "id": "daisyShirts"
    },
    {
        "name": "cds",
        "cost": 10,
        "stock": 44,
        "image": "https://firebasestorage.googleapis.com/v0/b/merchsystem-f2359.appspot.com/o/cdPhoto.png?alt=media&token=2dae4843-61ea-40d0-81a3-e4d32b130561",
        "id": "cds"
    }
]
const SessionScreen = () => {

    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({});
    const [localStock, setLocalStock] = useState({}); // Step 1: Introduce local stock state
    const navigate = useNavigate();
    const location = useLocation();
    const sessionId = location.state?.sessionId;
    const [sessionRevenue, setSessionRevenue] = useState(0);




    console.log("Session ID:", sessionId);
    useEffect(() => {
        const fetchSessionRevenue = async (sessionId) => {
            try {
                const sessionDocRef = doc(db, "sessions", sessionId);
                const docSnap = await getDoc(sessionDocRef);
                if (docSnap.exists()) {
                    console.log("Current session revenue fetched:", docSnap.data().revenue);
                    setSessionRevenue(docSnap.data().revenue || 0);
                } else {
                    console.log("No such session!");
                    setSessionRevenue(0); // Reset to 0 if no session found (optional based on your logic)
                }
            } catch (error) {
                console.error("Error fetching session revenue:", error);
                setSessionRevenue(0); // Handle error (optional based on your logic)
            }
        };

        if (sessionId) {
            fetchSessionRevenue(sessionId);
        }
    }, [sessionId]);


    useEffect(() => {
        if (isDevelopmentMode) {
            console.log('devMode')

            // Use local product data
            setProducts(localProductData);
            const initialStock = localProductData.reduce((acc, product) => {
                acc[product.id] = product.sizes ? { ...product.sizes } : { stock: product.stock };
                return acc;
            }, {});
            setLocalStock(initialStock);
        } else {
            const fetchProducts = async () => {
                const productFetches = Object.entries(productRefs).map(async ([key, ref]) => {
                    const docSnap = await getDoc(ref);
                    if (docSnap.exists()) {
                        return { ...docSnap.data(), id: key }; // Return a product object
                    } else {
                        console.log(`No such document for ${key}!`);
                        return null; // Return null if no document
                    }
                });

                const fetchedProducts = await Promise.all(productFetches); // Resolve all promises
                const validProducts = fetchedProducts.filter(Boolean); // Filter out any nulls
                setProducts(validProducts); // Set the products state with an array of products

                const initialStock = validProducts.reduce((acc, product) => {
                    acc[product.id] = product.sizes ? { ...product.sizes } : { stock: product.stock }; // Handle sizeless items
                    return acc;
                }, {});
                setLocalStock(initialStock); // Initialize local stock state
            };
            fetchProducts();
        }
    }, []);

    const endSession = () => {

        navigate('/')
    }


    const updateCart = (productName, size = null, delta) => {
        const product = products.find(p => p.id === productName);
        if (!product) return; // Exit if product is not found

        const cartKey = size ? `${productName}-${size}` : productName; // Key for cart item
        const currentQuantity = cart[cartKey]?.quantity || 0;
        const newQuantity = currentQuantity + delta;

        // Determine stock based on whether item has size
        const stock = size ? localStock[productName]?.[size] : localStock[productName]?.stock;
        const updatedStock = stock - delta; // Calculate updated stock after adding/removing from cart

        // Prevent adding beyond available stock
        if (delta > 0 && updatedStock < 0) {
            alert("Cannot add more items to cart than available in stock");
            return;
        }

        // Update cart
        if (newQuantity <= 0) {
            const { [cartKey]: _, ...rest } = cart; // Remove item from cart
            setCart(rest);
        } else {
            setCart(prevCart => ({
                ...prevCart,
                [cartKey]: { name: productName, size, quantity: newQuantity, cost: product.cost },
            }));
        }

        // Correctly update local stock based on the operation
        setLocalStock(prevLocalStock => {
            const updatedLocalStock = { ...prevLocalStock };
            if (size) {
                updatedLocalStock[productName][size] = updatedStock;
            } else {
                updatedLocalStock[productName].stock = updatedStock;
            }
            return updatedLocalStock;
        });
    };


    const addToCart = (productName, size = null) => updateCart(productName, size, 1);
    const removeFromCart = (productName, size = null) => updateCart(productName, size, -1);

    const calculateTotal = () => {
        return Object.values(cart).reduce((total, item) => total + (item.cost * item.quantity), 0);
    };


    const confirmOrder = async () => {
        console.log("Confirming order and updating stock in Firebase...");
        const batch = writeBatch(db);

        // Logic to update product stock using the batch
        Object.entries(cart).forEach(([key, item]) => {
            const product = products.find(p => p.id === item.name);
            if (product.sizes) {
                const newStock = product.sizes[item.size] - item.quantity;
                batch.update(productRefs[item.name], {
                    ["sizes." + item.size]: newStock // Directly access the size property for update
                });
            } else if (product.stock !== undefined) {
                const newStock = product.stock - item.quantity;
                batch.update(productRefs[item.name], { stock: newStock });
            }
        });

        await batch.commit();
        alert("Order confirmed!");

        const total = calculateTotal(); // Calculate the total for the current order

        // Update session revenue directly without waiting for state update
        await updateSession(sessionId, sessionRevenue + total);

        // Optionally update the local state to reflect the change
        // Note: This won't affect the immediate Firestore update but keeps the local state in sync for future actions
        setSessionRevenue(prevRevenue => prevRevenue + total);

        // Clear the cart after updating the session
        setCart({});
    };

    const updateSession = async (sessionId, newRevenue) => {
        try {
            const sessionDocRef = doc(db, "sessions", sessionId);
            await setDoc(sessionDocRef, { revenue: newRevenue }, { merge: true });
            console.log('Session Revenue Updated:', newRevenue);
        } catch (error) {
            console.error("Error updating session revenue: ", error);
        }
    };





    return (
        <div className='p-[50px] overflow-x-hidden'>
            <h1 className='text-3xl'>Products</h1>
            <h1 className='text-xl'>SessionID: {sessionId}</h1>
            <div className='flex justify-around gap-4 py-5 flex-wrap'>
                {products.map(product => (
                    // <div key={product.id} className='flex '>
                    <div className='flex md:basis-[550px] basis-[450px]'>
                        <img src={product.image} alt={product.name} className='md:w-[200px] w-[175px]  object-contain mx-10' />
                        <div className='flex flex-col items-start self-start min-w-[95%]'>
                            <h2 className=''>{product.name}</h2>
                            <h2 className='text-2xl text-green-300'>${product.cost}</h2>
                            <div className=''>
                                {product.sizes ?
                                    <div>
                                        <p>Sizes</p> {(
                                            Object.entries(localStock[product.id] || {}) // Use localStock for displaying stock levels
                                                .sort((a, b) => sizeOrder.indexOf(a[0]) - sizeOrder.indexOf(b[0]))
                                                .map(([size, stock]) => (
                                                    <div className='flex gap-5 align-baseline items-center ' key={size}>
                                                        <button onClick={() => addToCart(product.id, size)}><FaPlus /></button>
                                                        <button onClick={() => removeFromCart(product.id, size)}
                                                            disabled={!cart[`${product.id}-${size}`] || stock < 0} // Disable if stock is 0
                                                            className='disabled:opacity-50'>
                                                            <FaMinus />
                                                        </button>
                                                        <p>{size} ({stock} available)</p>
                                                    </div>
                                                ))
                                        )}
                                    </div> : (
                                        <div className='flex gap-4'>
                                            <button onClick={() => addToCart(product.id)}>
                                                <FaPlus />
                                            </button>
                                            <button onClick={() => removeFromCart(product.id)}
                                                disabled={!cart[product.id] || localStock[product.id].stock <= 0}
                                                className='disabled:opacity-50'
                                            >
                                                <FaMinus />
                                            </button>
                                            <p>({localStock[product.id].stock} available)</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        {/* </div> */}
                    </div>
                ))}
            </div>
            <div className='flex items-end justify-between'>
                <div>
                    <h2 className='text-green-400 text-3xl pt-10'>Total: ${calculateTotal()}</h2>
                    <button className="text-lg text-yellow-400 hover:text-white" onClick={confirmOrder}>Confirm Order</button>
                </div>
                <div className='text-right'>
                    <h2 className='text-3xl'>Revenue: ${sessionRevenue}</h2>
                    <button className='text-red-500' onClick={endSession}>End Session</button>
                </div>
            </div>
        </div >
    );
};

export default SessionScreen;