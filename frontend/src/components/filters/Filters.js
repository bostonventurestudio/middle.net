/*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 + Copyright (c) 2022, Boston Venture Studio, Inc - https://www.bvs.net/
 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

import React, {Component} from 'react';
import "./filters.css";

class Filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: props.filters,
        };

        this.handlePriceLevel1 = this.handlePriceLevel1.bind(this);
        this.handlePriceLevel2 = this.handlePriceLevel2.bind(this);
        this.handlePriceLevel3 = this.handlePriceLevel3.bind(this);
        this.handlePriceLevel4 = this.handlePriceLevel4.bind(this);
        this.handleHoursAll = this.handleHoursAll.bind(this);
        this.handleHoursOpenNow = this.handleHoursOpenNow.bind(this);
        this.handleTypeRestaurant = this.handleTypeRestaurant.bind(this);
        this.handleTypeCoffee = this.handleTypeCoffee.bind(this);
        this.handleTypeBar = this.handleTypeBar.bind(this);
        this.saveFilters = this.saveFilters.bind(this);
    }

    handlePriceLevel1() {
        this.setState({
            filters: {
                ...this.state.filters,
                price: {
                    ...this.state.filters.price,
                    price_level_1: !this.state.filters.price.price_level_1,
                }
            }
        });
    }

    handlePriceLevel2() {
        this.setState({
            filters: {
                ...this.state.filters,
                price: {
                    ...this.state.filters.price,
                    price_level_2: !this.state.filters.price.price_level_2,
                }
            }
        });
    }

    handlePriceLevel3() {
        this.setState({
            filters: {
                ...this.state.filters,
                price: {
                    ...this.state.filters.price,
                    price_level_3: !this.state.filters.price.price_level_3,
                }
            }
        });
    }

    handlePriceLevel4() {
        this.setState({
            filters: {
                ...this.state.filters,
                price: {
                    ...this.state.filters.price,
                    price_level_4: !this.state.filters.price.price_level_4,
                }
            }
        });
    }

    handleHoursAll() {
        this.setState({
            filters: {
                ...this.state.filters,
                hours: {
                    ...this.state.filters.hours,
                    all: !this.state.filters.hours.all,
                    open_now: !this.state.filters.hours.open_now,
                }
            }
        });
    }

    handleHoursOpenNow() {
        this.setState({
            filters: {
                ...this.state.filters,
                hours: {
                    ...this.state.filters.hours,
                    all: !this.state.filters.hours.all,
                    open_now: !this.state.filters.hours.open_now,
                }
            }
        });
    }

    handleTypeRestaurant() {
        this.setState({
            filters: {
                ...this.state.filters,
                type: {
                    ...this.state.filters.type,
                    restaurant: !this.state.filters.type.restaurant,
                }
            }
        });
    }

    handleTypeCoffee() {
        this.setState({
            filters: {
                ...this.state.filters,
                type: {
                    ...this.state.filters.type,
                    coffee: !this.state.filters.type.coffee,
                }
            }
        });
    }

    handleTypeBar() {
        this.setState({
            filters: {
                ...this.state.filters,
                type: {
                    ...this.state.filters.type,
                    bar: !this.state.filters.type.bar,
                }
            }
        });
    }

    saveFilters() {
        if ((this.state.filters.price.price_level_1 || this.state.filters.price.price_level_2 ||
            this.state.filters.price.price_level_3 || this.state.filters.price.price_level_4) && (this.state.filters.type.restaurant || this.state.filters.type.coffee || this.state.filters.type.bar)) {
            this.props.closeFilters();
            this.props.setFilters(this.state.filters);
        }
    }

    render() {
        const errorInPrice = !(this.state.filters.price.price_level_1 || this.state.filters.price.price_level_2 || this.state.filters.price.price_level_3 || this.state.filters.price.price_level_4);
        const errorInType = !(this.state.filters.type.restaurant || this.state.filters.type.coffee || this.state.filters.type.bar);
        return (
            <div className="filter-content">
                <div className="cancel-div">
                    <button className="cancel-btn" onClick={this.props.closeFilters}><i className="fa fa-close"/></button>
                </div>
                <div className="filter-price">
                    <span className="filter-head">Price</span>
                    <div className="filter-btns">
                        <button style={{width: "24%"}} className={this.state.filters.price.price_level_1 ? "btn-selected" : "btn"} onClick={this.handlePriceLevel1}>$</button>
                        <button style={{width: "24%"}} className={this.state.filters.price.price_level_2 ? "btn-selected" : "btn"} onClick={this.handlePriceLevel2}>$$</button>
                        <button style={{width: "24%"}} className={this.state.filters.price.price_level_3 ? "btn-selected" : "btn"} onClick={this.handlePriceLevel3}>$$$</button>
                        <button style={{width: "24%"}} className={this.state.filters.price.price_level_4 ? "btn-selected" : "btn"} onClick={this.handlePriceLevel4}>$$$$</button>
                    </div>
                    { errorInPrice && <span className="error">select at least 1 price level</span>}
                </div>
                <div className="filter-hours">
                    <span className="filter-head">Hours</span>
                    <div className="filter-btns">
                        <button style={{width: "49.5%"}} className={this.state.filters.hours.all ? "btn-selected" : "btn"} onClick={this.handleHoursAll}>All</button>
                        <button style={{width: "49.5%"}} className={this.state.filters.hours.open_now ? "btn-selected" : "btn"} onClick={this.handleHoursOpenNow}>Open Now</button>
                    </div>
                </div>
                <div className="filter-type">
                    <span className="filter-head">Type</span>
                    <div className="filter-btns">
                        <button style={{width: "33%"}} className={this.state.filters.type.restaurant ? "btn-selected" : "btn"} onClick={this.handleTypeRestaurant}>Restaurant</button>
                        <button style={{width: "33%"}} className={this.state.filters.type.coffee ? "btn-selected" : "btn"} onClick={this.handleTypeCoffee}>Coffee</button>
                        <button style={{width: "33%"}} className={this.state.filters.type.bar ? "btn-selected" : "btn"} onClick={this.handleTypeBar}>Bar</button>
                    </div>
                    {errorInType && <span className="error">select at least 1 type</span>}
                </div>
                <div className="save-div">
                    <button className={ !errorInPrice && !errorInType ? "save-btn" : "save-btn disabled"} onClick={this.saveFilters}>Save</button>
                </div>
            </div>
        );
    }
}

export default Filters;