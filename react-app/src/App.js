import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import DataFiles from "./components/DataFiles";
import PostVisualization from "./components/PostVisualizationModal";
import AllVisualizations from "./components/AllVisulazations";
import VisualizationDetail from "./components/VisualizationDetail";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(authenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login" >
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/libary">
            <DataFiles />
            </Route>
            <Route path="/graph/:id" exact={true}>
            <VisualizationDetail />
          </Route>
          
          
          <Route path="/graph">
            <AllVisualizations />
      
          </Route>
         
          
        </Switch>
      )}
    </>
  );
}

export default App;
