import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import {
    extension as ExtensionActions,
    pagination as PaginationActions
} from "actions";
import Localization from "localization";
import GridCell from "dnn-grid-cell";
import ExtensionList from "./ExtensionList";
import DropdownWithError from "dnn-dropdown-with-error";
import "./style.less";
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
        if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
        return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
}

class AvailableExtensions extends Component {
    constructor() {
        super();
        this.handleSelect = this.handleSelect.bind(this);
    }
    checkIfAvailablePackageTypesEmpty(props) {
        return !props.availablePackageTypes || props.availablePackageTypes.length === 0;
    }

    checkIfAvailablePackagesEmpty(props) {
        return !props.availablePackages || props.availablePackages.length === 0;
    }
    componentWillReceiveProps(props) {
        if (!this.checkIfAvailablePackageTypesEmpty(props) && this.checkIfAvailablePackagesEmpty(props) && props.selectedAvailablePackageType === "") {
            props.dispatch(ExtensionActions.getAvailablePackages(props.availablePackageTypes[0].Type));
        }
    }

    handleSelect(index/*, last*/) {
        const {props} = this;
        props.dispatch(PaginationActions.loadTab(index));   //index acts as scopeTypeId
    }

    onChange(key, event) {
        this.setState({
            [key]: event.target.value
        });
    }

    onSelectChange(option) {
        this.setState({
            selectValue: option.value
        });
    }
    onFilterSelect(option) {
        const {props} = this;
        props.dispatch(ExtensionActions.getAvailablePackages(option.value));
    }
    onDownload(name, event) {
        if (event) {
            event.preventDefault();
        }
        const {props} = this;
        props.dispatch(ExtensionActions.downloadPackage(props.selectedAvailablePackageType, name));
    }
    render() {
        const {props} = this;
        return (
            <GridCell className="extension-list">
                <GridCell className="collapse-section">
                    <DropdownWithError className="filter-dropdown" onSelect={this.onFilterSelect.bind(this)} options={props.availablePackageTypes && props.availablePackageTypes.map((_package) => {
                        return {
                            label: _package.Type.split("_").join("").split(/(?=[A-Z])/).join(" "),
                            value: _package.Type
                        };
                    })}
                        label={Localization.get("Showing.Label")}
                        value={props.selectedAvailablePackageType}
                        labelType="inline" />
                </GridCell>

                {(props.availablePackages && props.availablePackages.length > 0) &&
                    <ExtensionList
                        packages={props.availablePackages}
                        onDownload={this.onDownload.bind(this)} />
                }
            </GridCell>
        );
    }
}

AvailableExtensions.propTypes = {
    dispatch: PropTypes.func.isRequired,
    availablePackages: PropTypes.array,
    tabIndex: PropTypes.number
};

function mapStateToProps(state) {
    return {
        availablePackageTypes: state.extension.availablePackageTypes,
        availablePackages: state.extension.availablePackages,
        selectedAvailablePackageType: state.extension.selectedAvailablePackageType,
        tabIndex: state.pagination.tabIndex
    };
}

export default connect(mapStateToProps)(AvailableExtensions);