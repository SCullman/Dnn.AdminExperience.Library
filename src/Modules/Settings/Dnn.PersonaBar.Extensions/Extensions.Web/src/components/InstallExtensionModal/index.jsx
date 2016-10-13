import React, { PropTypes, Component } from "react";
import { connect } from "react-redux";
import GridCell from "dnn-grid-cell";
import SocialPanelHeader from "dnn-social-panel-header";
import SocialPanelBody from "dnn-social-panel-body";
import InstallLog from "./InstallLog";
import { extension as ExtensionActions, installation as InstallationActions } from "actions";
import PackageInformation from "../EditExtension/PackageInformation";
import ReleaseNotes from "../Editextension/ReleaseNotes";
import License from "../EditExtension/License";
import Button from "dnn-button";
import Localization from "localization";
import utilities from "utils";
import FileUpload from "./FileUpload";
import styles from "./style.less";

class InstallExtensionModal extends Component {
    constructor() {
        super();
        this.state = {
            package: null,
            wizardStep: 0,
            repairInstallChecked: false
        };
    }

    onPackageChange(event) {
        const files = event.target.files;

        if (files && files.length > 0) {
            this.setState({
                package: files[0]
            });
        }
    }

    goToStep(wizardStep) {
        const { props } = this;
        props.dispatch(InstallationActions.navigateWizard(wizardStep));
    }

    parsePackage(file, callback, errorCallback) {
        if (!file) {
            utilities.utilities.notifyError(Localization.get("InstallExtension_EmptyPackage.Error"));
            return;
        }
        const {props} = this;
        this.setState({
            package: file
        }, () => {
            props.dispatch(InstallationActions.parsePackage(file, data => {
                data = JSON.parse(data);
                if (!data.success) {
                    if (errorCallback) {
                        errorCallback();
                    }
                }
                if (callback) {
                    callback(data.alreadyInstalled);
                }
            }, () => {
                if (errorCallback) {
                    errorCallback();
                }
            }));
        });
    }

    goToReleaseNotes() {
        this.goToStep(2);
    }

    goToLicense() {
        this.goToStep(3);
    }

    installPackage() {
        const {props} = this;
        props.dispatch(InstallationActions.installExtension(this.state.package, () => {
            this.goToStep(4);
        }));
    }

    onCheckRepairInstall(value) {
        this.setState({
            repairInstallChecked: value
        });
    }

    cancelInstall(cancelRevertStep) {
        const {props} = this;
        props.dispatch(InstallationActions.clearParsedInstallationPackage(() => {
            if (!cancelRevertStep) {
                this.goToStep(0);
            }
        }));
        this.setState({
            package: null
        });
    }

    getPackageInformationStep() {
        const {props} = this;
        if (props.parsedInstallationPackage) {
            return <PackageInformation
                extensionBeingEdited={props.parsedInstallationPackage}
                onChange={() => { } }
                onCancel={this.endInstallation.bind(this)}
                onPrimaryButtonClick={this.goToReleaseNotes.bind(this)}
                primaryButtonText="Next"
                disabled={true} />;
        }
    }

    endInstallation() {
        const { props } = this;
        props.onCancel();
        this.cancelInstall();
    }

    render() {
        const {props, state} = this;
        const {wizardStep} = props;
        return (
            <GridCell className={styles.installExtensionModal}>
                <SocialPanelHeader title="Install Extension" />
                <SocialPanelBody>
                    <GridCell className="install-extension-box extension-form">
                        {wizardStep === 0 &&
                            <GridCell>
                                <h3 className="box-title">{Localization.get("InstallExtension_UploadPackage.Header")}</h3>
                                <p>{Localization.get("InstallExtension_UploadPackage.HelpText")}</p>
                                <GridCell className="upload-package-box">
                                    <FileUpload
                                        parsePackage={this.parsePackage.bind(this)}
                                        repairInstall={this.goToStep.bind(this, 1)}
                                        cancelInstall={this.cancelInstall.bind(this)} />
                                </GridCell>
                                <GridCell className="modal-footer">
                                    <Button onClick={props.onCancel.bind(this)}>{Localization.get("InstallExtension_Cancel.Button")}</Button>
                                    <Button onClick={this.goToStep.bind(this, 1)} type="primary" disabled={!props.parsedInstallationPackage}>{Localization.get("InstallExtension_Upload.Button")}</Button>
                                </GridCell>
                            </GridCell>
                        }
                        {wizardStep === 1 && this.getPackageInformationStep()}
                        {wizardStep === 2 &&
                            <ReleaseNotes
                                extensionBeingEdited={props.parsedInstallationPackage}
                                onCancel={this.endInstallation.bind(this)}
                                onUpdateExtension={this.goToLicense.bind(this)}
                                primaryButtonText="Next"
                                readOnly={true}
                                disabled={true} />}
                        {wizardStep === 3 &&
                            <License
                                extensionBeingEdited={props.parsedInstallationPackage}
                                onCancel={this.endInstallation.bind(this)}
                                readOnly={true}
                                onUpdateExtension={this.installPackage.bind(this)}
                                primaryButtonText="Next"
                                disabled={true} />}
                        {wizardStep === 4 &&
                            <InstallLog
                                logs={props.installationLogs}
                                onDone={this.endInstallation.bind(this)}
                                primaryButtonText="Next" />}

                        <p className="modal-pagination">{"-- " + (props.wizardStep + 1) + " of 5 --"} </p>
                    </GridCell>
                </SocialPanelBody>
            </GridCell>
        );
        // <p className="modal-pagination"> --1 of 2 -- </p>
    }
}

InstallExtensionModal.PropTypes = {
    dispatch: PropTypes.func.isRequired,
    onCancel: PropTypes.func
};

function mapStateToProps(state) {
    return {
        parsedInstallationPackage: state.installation.parsedInstallationPackage,
        wizardStep: state.installation.installWizardStep,
        installationLogs: state.installation.installationLogs
    };
}

export default connect(mapStateToProps)(InstallExtensionModal);