"use client";
import { allProducts } from "@/data/products";
// import { openCartModal } from "@/utlis/openCartModal";
// import { openWistlistModal } from "@/utlis/openWishlist";

import React, { useEffect, useContext, useState, ReactNode } from "react";

export interface ContextType {
  cartProducts: any[];
  setCartProducts: React.Dispatch<React.SetStateAction<any[]>>;
  wishList: number[];
  setWishList: React.Dispatch<React.SetStateAction<number[]>>;
  compareItem: number[];
  setCompareItem: React.Dispatch<React.SetStateAction<number[]>>;
  quickViewItem: any;
  setQuickViewItem: React.Dispatch<React.SetStateAction<any>>;
  quickAddItem: number;
  setQuickAddItem: React.Dispatch<React.SetStateAction<number>>;
  totalPrice: number;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  addProductToCart: (id: number, qty?: number, isModal?: boolean) => void;
  isAddedToCartProducts: (id: number) => boolean;
  updateQuantity: (id: number, qty: number) => void;
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
  addToCompareItem: (id: number) => void;
  removeFromCompareItem: (id: number) => void;
  isAddedtoWishlist: (id: number) => boolean;
  isAddedtoCompareItem: (id: number) => boolean;
}

const dataContext = React.createContext<ContextType | undefined>(undefined);

export const useContextElement = () => {
  const context = useContext(dataContext);
  if (!context) {
    throw new Error("useContextElement must be used within a Context Provider");
  }
  return context;
};

export default function Context({ children }: { children: ReactNode }) {
  const [cartProducts, setCartProducts] = useState<any[]>([]);
  const [wishList, setWishList] = useState<number[]>([1, 2, 3]);
  const [compareItem, setCompareItem] = useState<number[]>([1, 2, 3, 4]);
  const [quickViewItem, setQuickViewItem] = useState(allProducts[0]);
  const [quickAddItem, setQuickAddItem] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const isAddedToCartProducts = (id: number) => {
    if (cartProducts.filter((elm) => elm.id == id)[0]) {
      return true;
    }
    return false;
  };
  const addProductToCart = (id: number, qty?: number, isModal: boolean = true) => {
    if (!isAddedToCartProducts(id)) {
      const item = {
        ...allProducts.filter((elm) => elm.id == id)[0],
        quantity: qty ? qty : 1,
      };
      setCartProducts((pre) => [...pre, item]);
      if (isModal) {
        // openCartModal();
      }
    }
  };

  const updateQuantity = (id: number, qty: number) => {
    if (isAddedToCartProducts(id) && qty >= 1) {
      let item = cartProducts.filter((elm) => elm.id == id)[0];
      let items = [...cartProducts];
      const itemIndex = items.indexOf(item);

      item.quantity = qty / 1;
      items[itemIndex] = item;
      setCartProducts(items);
    }
  };

  const addToWishlist = (id: number) => {
    if (!wishList.includes(id)) {
      setWishList((pre) => [...pre, id]);
      //   openWistlistModal();
    } else {
      setWishList((pre) => pre.filter((elm) => elm != id));
    }
  };

  const removeFromWishlist = (id: number) => {
    if (wishList.includes(id)) {
      setWishList((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };
  const addToCompareItem = (id: number) => {
    if (!compareItem.includes(id)) {
      setCompareItem((pre) => [...pre, id]);
    }
  };
  const removeFromCompareItem = (id: number) => {
    if (compareItem.includes(id)) {
      setCompareItem((pre) => [...pre.filter((elm) => elm != id)]);
    }
  };
  const isAddedtoWishlist = (id: number) => {
    if (wishList.includes(id)) {
      return true;
    }
    return false;
  };
  const isAddedtoCompareItem = (id: number) => {
    if (compareItem.includes(id)) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartList") || "[]");
    if (items?.length) {
      setCartProducts(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartProducts));
  }, [cartProducts]);
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (items?.length) {
      setWishList(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    isAddedToCartProducts,
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    updateQuantity,
    setWishList,
    setTotalPrice,
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
