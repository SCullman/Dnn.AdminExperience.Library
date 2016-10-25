import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
    pagination as PaginationActions,
    siteSettings as SiteSettingsActions
} from "../../actions";
import InputGroup from "dnn-input-group";
import SingleLineInputWithError from "dnn-single-line-input-with-error";
import PagePicker from "dnn-page-picker";
import Grid from "dnn-grid-system";
import Switch from "dnn-switch";
import Dropdown from "dnn-dropdown";
import Label from "dnn-label";
import Button from "dnn-button";
import "./style.less";
import util from "../../utils";
import resx from "../../resources";
import styles from "./style.less";

class ProfileSettingsPanelBody extends Component {
    constructor() {
        super();
        this.state = {
            profileSettings: undefined
        };
    }

    componentWillMount() {
        const {state, props} = this;
        if (props.profileSettings) {
            this.setState({
                profileSettings: props.profileSettings
            });
            return;
        }
        props.dispatch(SiteSettingsActions.getProfileSettings(props.portalId, (data) => {
            this.setState({
                profileSettings: Object.assign({}, data.Settings)
            });
        }));
    }

    componentWillReceiveProps(props) {
        let {state} = this;

        this.setState({
            profileSettings: Object.assign({}, props.profileSettings)
        });
    }

    getProfileVisibilityOptions() {
        let options = [];
        if (this.props.userVisibilityOptions !== undefined) {
            options = this.props.userVisibilityOptions.map((item) => {
                return { label: resx.get(item.label), value: item.value };
            });
        }
        return options;
    }

    onSettingChange(key, event) {
        let {state, props} = this;

        let profileSettings = Object.assign({}, state.profileSettings);
        if (key === "ProfileDefaultVisibility") {
            profileSettings[key] = event.value;
        }
        else {
            profileSettings[key] = typeof (event) === "object" ? event.target.value : event;
        }
        this.setState({
            profileSettings: profileSettings
        });

        props.dispatch(SiteSettingsActions.profileSettingsClientModified(profileSettings));
    }

    onUpdate(event) {
        event.preventDefault();
        const {props, state} = this;

        props.dispatch(SiteSettingsActions.updateProfileSettings(state.profileSettings, (data) => {
            util.utilities.notify(resx.get("SettingsUpdateSuccess"));
        }, (error) => {
            util.utilities.notifyError(resx.get("SettingsError"));
        }));
    }

    onCancel(event) {
        const {props, state} = this;
        util.utilities.confirm(resx.get("SettingsRestoreWarning"), resx.get("Yes"), resx.get("No"), () => {
            props.dispatch(SiteSettingsActions.getProfileSettings(props.portalId, (data) => {
                let profileSettings = Object.assign({}, data.Settings);
                this.setState({
                    profileSettings
                });
            }));
        });
    }

    /* eslint-disable react/no-danger */
    render() {
        const {props, state} = this;
        if (state.profileSettings) {
            const columnOne = <div className="left-column">
                <InputGroup>
                    <Label
                        tooltipMessage={resx.get("Profile_DefaultVisibility.Help")}
                        label={resx.get("Profile_DefaultVisibility")}
                        />
                    <Dropdown
                        options={this.getProfileVisibilityOptions()}
                        value={state.profileSettings.ProfileDefaultVisibility}
                        onSelect={this.onSettingChange.bind(this, "ProfileDefaultVisibility")}
                        />
                </InputGroup>
                <InputGroup>
                    <div className="profileSettings-row_switch">
                        <Label
                            labelType="inline"
                            tooltipMessage={resx.get("redirectOldProfileUrlsLabel.Help")}
                            label={resx.get("redirectOldProfileUrlsLabel")}
                            />
                        <Switch
                            labelHidden={true}
                            value={state.profileSettings.RedirectOldProfileUrl}
                            onChange={this.onSettingChange.bind(this, "RedirectOldProfileUrl")}
                            />
                    </div>
                </InputGroup>
            </div>;
            const columnTwo = <div className="right-column">
                <InputGroup>
                    <Label
                        tooltipMessage={resx.get("vanilyUrlPrefixLabel.Help")}
                        label={resx.get("vanilyUrlPrefixLabel")}
                        />
                    <SingleLineInputWithError
                        inputStyle={{ margin: "0" }}
                        withLabel={false}
                        error={false}
                        value={state.profileSettings.VanityUrlPrefix}
                        onChange={this.onSettingChange.bind(this, "VanityUrlPrefix")}
                        />
                    <div className="VanityUrlPrefix">/{resx.get("VanityUrlExample")}</div>
                </InputGroup>
                <InputGroup>
                    <div className="profileSettings-row_switch">
                        <Label
                            labelType="inline"
                            tooltipMessage={resx.get("Profile_DisplayVisibility.Help")}
                            label={resx.get("Profile_DisplayVisibility")}
                            />
                        <Switch
                            labelHidden={true}
                            value={state.profileSettings.ProfileDisplayVisibility}
                            onChange={this.onSettingChange.bind(this, "ProfileDisplayVisibility")}
                            />
                    </div>
                </InputGroup>
            </div>;

            return (
                <div className={styles.profileSettings}>
                    <div className="sectionTitleNoBorder">{resx.get("UserProfileSettings")}</div>
                    <Grid children={[columnOne, columnTwo]} numberOfColumns={2} />
                    <div className="buttons-box">
                        <Button
                            disabled={!this.props.profileSettingsClientModified}
                            type="secondary"
                            onClick={this.onCancel.bind(this)}>
                            {resx.get("Cancel")}
                        </Button>
                        <Button
                            disabled={!this.props.profileSettingsClientModified}
                            type="primary"
                            onClick={this.onUpdate.bind(this)}>
                            {resx.get("Save")}
                        </Button>
                    </div>
                </div>
            );
        }
        else return <div />;
    }
}

ProfileSettingsPanelBody.propTypes = {
    dispatch: PropTypes.func.isRequired,
    tabIndex: PropTypes.number,
    profileSettings: PropTypes.object,
    userVisibilityOptions: PropTypes.array,
    profileSettingsClientModified: PropTypes.bool,
    portalId: PropTypes.number
};

function mapStateToProps(state) {
    return {
        tabIndex: state.pagination.tabIndex,
        profileSettings: state.siteSettings.profileSettings,
        userVisibilityOptions: state.siteSettings.userVisibilityOptions,
        profileSettingsClientModified: state.siteSettings.profileSettingsClientModified
    };
}

export default connect(mapStateToProps)(ProfileSettingsPanelBody);