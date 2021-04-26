import React, { createContext, useContext, useReducer } from "react";

// Prepares the Data Layer..
export const StateContext = createContext();

// Wrapping our app in StateProvider provides us a way to access the values from reducer(in this case) inside any part of the application..
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

// Fetch information from the context into our component..
export const useStateValue = () => useContext(StateContext);
