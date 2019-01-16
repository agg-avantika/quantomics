import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Header from './Components/header';
import HOME from './Containers/home';
import ANALYSIS from './Containers/analysis';



class App extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <Header />
                <Switch>
                    <Route exact path='/' component={HOME}/>
                    <Route path='/analysis' component={ANALYSIS}/>
                </Switch>
            </div>
        );
    }
}

export default App;
