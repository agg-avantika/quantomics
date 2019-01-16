import React from 'react';
import Select from 'react-select';

class SelectComp extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            selectedOption: null
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(selectedOption){
        this.setState({ selectedOption:selectedOption });
        this.props.handlechange(selectedOption);
    }
    render() {
        return (
            <Select
                value={this.state.selectedOption}
                onChange={this.handleChange}
                options={this.props.options}
            />
        );
    }
}

export default SelectComp;
