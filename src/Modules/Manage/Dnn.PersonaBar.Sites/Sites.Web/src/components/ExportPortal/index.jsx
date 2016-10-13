import React, {Component, PropTypes } from "react";
import { connect } from "react-redux";
import SocialPanelHeader from "dnn-social-panel-header";
import SocialPanelBody from "dnn-social-panel-body";
import { portal as PortalActions } from "../../actions";
import Label from "dnn-label";
import CheckBox from "dnn-checkbox";
import GridCell from "dnn-grid-cell";
import GridSystem from "dnn-grid-system";
import ToolTip from "dnn-tooltip";
import SingleLineInputWithError from "dnn-single-line-input-with-error";
import MultiLineInputWithError from "dnn-multi-line-input-with-error";
import Button from "dnn-button";
import Dropdown from "dnn-dropdown";
import Switch from "dnn-switch";
import PagePicker from "./PagePicker/PagePicker";
import "./style.less";
import util from "../../utils";
import stringUtils from "../../utils/string";
import Localization from "localization";


const emptyExport = {
    fileName: "",
    description: "",
    portalId: -1,
    pages: [],
    locales: [],
    isMultiLanguage: false,
    includeContent: false,
    includeFiles: false,
    includeRoles: true,
    includeProfile: true,
    includeModules: true,
    localizationCulture: "en-US"
};
const scrollAreaStyle = {
    width: "100%",
    height: 200,
    marginTop: 0,
    border: "1px solid #c8c8c8"
};
const keysToValidate = ["fileName", "description"];
class ExportPortal extends Component {
    constructor() {
        super();
        this.state = {
            localData: {
                locales: [],
                errors: {
                    fileName: false,
                    description: false
                }
            },
            portalBeingExported: emptyExport,
            portalTabs: []
        };
    }

    componentWillMount() {
        const { props } = this;
        props.dispatch(PortalActions.getPortalLocales(props.portalBeingExported.PortalID, (data) => {
            const {portalBeingExported} = this.state;
            const {localData} = this.state;
            portalBeingExported.portalId = props.portalBeingExported.PortalID;
            portalBeingExported.portalName = props.portalBeingExported.PortalName;
            localData.locales = data.Results;
            portalBeingExported.locales = data.Results.map(locale => { return locale.Code; });
            portalBeingExported.isMultiLanguage = props.portalBeingExported.contentLocalizable;
            portalBeingExported.localizationCulture = props.portalBeingExported.DefaultLanguage;
            this.setState({
                portalBeingExported,
                localData
            }, () => {
                this.getPortalTabs();
            });
        }));
    }

    getPortalTabs(cultureCode, callback) {
        const { props, state } = this;
        const portalTabsParameters = {
            portalId: state.portalBeingExported.portalId,
            cultureCode: cultureCode !== undefined ? cultureCode : state.portalBeingExported.localizationCulture,
            isMultiLanguage: state.portalBeingExported.isMultiLanguage
        };
        props.dispatch(PortalActions.getPortalTabs(portalTabsParameters, (data) => {
            this.setState({
                portalTabs: [data.Results]
            });
            if (callback) {
                callback();
            }
        }));
    }

    onChange(key, event) {
        const value = typeof event === "object" ? event.target.value : event;
        let {portalBeingExported} = this.state;
        portalBeingExported[key] = value;
        this.setState({
            portalBeingExported
        });
        if (keysToValidate.some(vkey => vkey == key))
            this.ValidateTexts(key);
    }

    onExportPortal() {
        const { props, state } = this;
        if (this.Validate()) {
            props.dispatch(PortalActions.exportPortal(state.portalBeingExported, (data) => {
                util.utilities.notify(data.Message);
                if (data.Success) {
                    let {portalBeingExported} = state;
                    portalBeingExported.fileName = "";
                    portalBeingExported.description = "";
                    this.setState({ portalBeingExported },()=>{
                        props.onCancel();
                    });
                }
            }));
        }
    }
    Validate() {
        let success = true;
        const {portalBeingExported} = this.state;
        success = this.ValidateTexts();
        // if (success && this.props.portalBeingExported.contentLocalizable && portalBeingExported.isMultiLanguage && portalBeingExported.locales.length <= 0) {
        //     success = false;
        //     util.utilities.notify("At least one language must be selected.");//This error shouldn't happen because the default locale is disabled.
        // }
        if (success && portalBeingExported.pages.length <= 0) {
            success = false;
            util.utilities.notify(Localization.get("ErrorPages"));
        }
        return success;
    }
    ValidateTexts(key) {
        let success = true;
        const {portalBeingExported} = this.state;
        const {localData} = this.state;
        keysToValidate.map(vkey => {
            if (key === undefined || key == vkey) {
                if (portalBeingExported[vkey] === "") {
                    success = false;
                    localData.errors[vkey] = true;
                } else {
                    localData.errors[vkey] = false;
                }
            }
            this.setState({});
        });

        return success;
    }
    onLanguageSelectionChange(option) {
        let {portalBeingExported} = this.state;

        portalBeingExported.localizationCulture = option.value;
        this.getPortalTabs(option.value, () => {
            this.setState({ portalBeingExported });
        });
    }
    createLocaleOptions(native) {
        let localeOptions = [];
        localeOptions = this.state.localData.locales.map(locale => {
            if (native)//There is need of mechanism to get native name
                return { label: locale.EnglishName, value: locale.Code };
            else
                return { label: locale.EnglishName, value: locale.Code };
        });
        return localeOptions;
    }
    onLanguageCheckBoxChange(Code, event) {
        let {portalBeingExported} = this.state;
        if (event && !portalBeingExported.locales.some(sl => sl === Code)) {
            portalBeingExported.locales = portalBeingExported.locales.concat([Code]);
        } else if (!event && portalBeingExported.locales.some(sl => sl === Code)) {
            portalBeingExported.locales = portalBeingExported.locales.filter(sl => sl !== Code);
        }
        this.setState({ portalBeingExported });
    }
    createLanguageDropDownOptions() {
        let {state} = this;
        return state.localData.locales.map(locale => {
            return {
                label: <div><CheckBox
                    label={locale.EnglishName}
                    value={state.portalBeingExported.locales.some(sl => sl === locale.Code) }
                    onChange={this.onLanguageCheckBoxChange.bind(this, locale.Code) }
                    enabled={this.props.portalBeingExported.DefaultLanguage !== locale.Code}
                    />
                    {locale.Code === state.portalBeingExported.localizationCulture
                        && <ToolTip messages={[stringUtils.format(Localization.get("lblNote"), locale.EnglishName)]} />
                    }
                </div>,
                value: locale.Code
            };
        });
    }
    updatePagesToExport(selectedPages) {
        let {portalBeingExported} = this.state;
        portalBeingExported.pages = selectedPages;
        this.setState({ portalBeingExported });
    }

    render() {
        const {props, state} = this;
        const localeOptions = this.createLocaleOptions();
        const dropdownOptions = this.createLanguageDropDownOptions();
        return (
            <div className="export-portal">
                <SocialPanelHeader title={Localization.get("ControlTitle_template") }/>
                <SocialPanelBody>
                    <GridCell className="export-site-container">
                        <h3 className="site-template-info-title">{Localization.get("titleTemplateInfo") }</h3>
                        <GridCell>
                            <SingleLineInputWithError
                                label={Localization.get("plPortals") }
                                tooltipMessage={Localization.get("plPortals.Help") }
                                enabled={false}
                                value={state.portalBeingExported.portalName}
                                error={false}
                                />
                        </GridCell>
                        <GridCell>
                            <SingleLineInputWithError
                                label={Localization.get("plTemplateName") + "*"}
                                tooltipMessage={Localization.get("plTemplateName.Help") }
                                onChange={this.onChange.bind(this, "fileName") }
                                error={state.localData.errors.fileName}
                                errorMessage={Localization.get("valFileName.ErrorMessage") }
                                value={state.portalBeingExported.fileName}
                                />
                        </GridCell>
                        <GridCell>
                            <MultiLineInputWithError
                                label={Localization.get("plDescription") + "*"}
                                tooltipMessage={Localization.get("plDescription.Help") }
                                className="portal-description"
                                onChange={this.onChange.bind(this, "description") }
                                error={state.localData.errors.description}
                                errorMessage={Localization.get("valDescription.ErrorMessage") }
                                value={state.portalBeingExported.description}
                                />
                            <hr/>
                        </GridCell>
                        <GridSystem>
                            <div className="export-switches">
                                <Switch
                                    label={Localization.get("plContent") }
                                    tooltipMessage={Localization.get("plContent.Help") }
                                    value={state.portalBeingExported.includeContent}
                                    onChange={this.onChange.bind(this, "includeContent") }
                                    />
                                <Switch
                                    label={Localization.get("lblFiles") }
                                    tooltipMessage={Localization.get("lblFiles.Help") }
                                    value={state.portalBeingExported.includeFiles}
                                    onChange={this.onChange.bind(this, "includeFiles") }
                                    />
                                <Switch
                                    label={Localization.get("lblRoles") }
                                    tooltipMessage={Localization.get("lblRoles.Help") }
                                    value={state.portalBeingExported.includeRoles}
                                    onChange={this.onChange.bind(this, "includeRoles") }
                                    />
                                <Switch
                                    label={Localization.get("lblProfile") }
                                    tooltipMessage={Localization.get("lblProfile.Help") }
                                    value={state.portalBeingExported.includeProfile}
                                    onChange={this.onChange.bind(this, "includeProfile") }
                                    />
                                <Switch
                                    label={Localization.get("lblModules") }
                                    tooltipMessage={Localization.get("lblModules.Help") }
                                    value={state.portalBeingExported.includeModules}
                                    onChange={this.onChange.bind(this, "includeModules") }
                                    />
                                {props.portalBeingExported.contentLocalizable &&
                                    <Switch
                                        label={Localization.get("lblMultilanguage") }
                                        tooltipMessage={Localization.get("lblMultilanguage.Help") }
                                        value={state.portalBeingExported.isMultiLanguage}
                                        onChange={this.onChange.bind(this, "isMultiLanguage") }
                                        />
                                }
                            </div>
                            {state.portalBeingExported.portalId >= 0 &&
                                <div className="export-pages">
                                    {props.portalBeingExported.contentLocalizable &&
                                        <div className="language-box">
                                            <Label label={Localization.get("lblLanguages") } tooltipMessage={Localization.get("lblLanguages.Help") } />
                                            {!state.portalBeingExported.isMultiLanguage && <Dropdown options={localeOptions } value={state.portalBeingExported.localizationCulture}
                                                onSelect={this.onLanguageSelectionChange.bind(this) } /> }
                                            {state.portalBeingExported.isMultiLanguage &&
                                                <Dropdown options={dropdownOptions } label={Localization.get("lblSelectLanguages") }
                                                    closeOnClick={false}/>
                                            }
                                        </div>
                                    }
                                    <Label label={Localization.get("lblPages") } tooltipMessage={Localization.get("lblPages.Help") }/>
                                    {state.portalTabs.length > 0 && <PagePicker portalId={state.portalBeingExported.portalId}
                                        cultureCode={state.portalBeingExported.localizationCulture}
                                        IsMultiLanguage={state.portalBeingExported.isMultiLanguage}
                                        portalTabs={ state.portalTabs }
                                        scrollAreaStyle={scrollAreaStyle}
                                        updateSelectionData={this.updatePagesToExport.bind(this) }
                                        allSelected={true}
                                        />
                                    }
                                </div>
                            }
                        </GridSystem>
                        <GridCell className="site-action-buttons">
                            <Button type="secondary" onClick={props.onCancel.bind(this) }>{Localization.get("cmdCancel") }</Button>
                            <Button type="primary" onClick={this.onExportPortal.bind(this) }>{Localization.get("cmdExport") }</Button>
                        </GridCell>
                    </GridCell>
                </SocialPanelBody>
            </div>
        );
    }
}

ExportPortal.propTypes = {
    dispatch: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    portalBeingExported: PropTypes.object
};


function mapStateToProps(state) {
    return {
        portalTemplates: state.portal.templates
    };
}


export default connect(mapStateToProps)(ExportPortal);