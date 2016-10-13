import React, {Component, PropTypes } from "react";
import GridCell from "dnn-grid-cell";
import ExtensionHeader from "../common/ExtensionHeader";
import ExtensionDetailRow from "../common/ExtensionDetailRow";
import styles from "./style.less";

class ExtensionList extends Component {
    constructor() {
        super();
    }
    render() {
        const {props, state} = this;

        return (
            <GridCell className={styles.extensionList}>
                <ExtensionHeader />
                {props.packages.map((_package, index) => {
                    return <ExtensionDetailRow
                        _package={_package}
                        onEdit={props.onEdit.bind(this, index)}
                        onDelete={props.onDelete.bind(this, _package.packageId, index)}
                        />;
                }) }
            </GridCell>
        );
    }
}

ExtensionList.propTypes = {
    label: PropTypes.string,
    packages: PropTypes.array,
    collapsed: PropTypes.bool,
    onChange: PropTypes.func,
    onEdit: PropTypes.func
};


export default ExtensionList;