import {task as ActionTypes}  from "../constants/actionTypes";
import ApplicationService from "../services/applicationService";

const taskActions = {
    getTaskStatusList(searchParameters, callback) {
        return (dispatch) => {
            ApplicationService.getTaskStatusList(searchParameters, data => {
                dispatch({
                    type: ActionTypes.RETRIEVED_TASK_STATUS_LIST,
                    data: {
                        schedulingEnabled: data.Results.SchedulingEnabled,
                        status: data.Results.Status,
                        freeThreads: data.Results.FreeThreadCount,
                        activeThreads: data.Results.ActiveThreadCount,
                        maxThreads: data.Results.MaxThreadCount,
                        taskProcessingList: data.Results.ScheduleProcessing,
                        taskStatusList: data.Results.ScheduleQueue,
                        totalCount: data.TotalResults
                    }
                });
                if (callback) {
                    callback(data);
                }
            });
        };
    },
    startSchedule(callback) {
        return (dispatch) => {
            ApplicationService.startSchedule(data => {
                dispatch({
                    type: ActionTypes.STARTED_SCHEDULE,
                    data: {

                    }
                });
                if (callback) {
                    callback(data);
                }
            });
        };
    },
    stopSchedule(callback) {
        return (dispatch) => {
            ApplicationService.stopSchedule(data => {
                dispatch({
                    type: ActionTypes.STOPPED_SCHEDULE,
                    data: {

                    }
                });
                if (callback) {
                    callback(data);
                }
            });
        };
    },
    getSchedulerSettings(callback) {
        return (dispatch) => {
            ApplicationService.getSchedulerSettings(data => {
                dispatch({
                    type: ActionTypes.RETRIEVED_SCHEDULE_SETTINGS,
                    data: {
                        schedulerModeOptions: data.Results.SchedulerModeOptions,
                        schedulerMode: data.Results.SchedulerMode,
                        schedulerDelay: data.Results.SchedulerdelayAtAppStart
                    }
                });
                if (callback) {
                    callback(data);
                }
            });
        };
    },
    updateSchedulerSettings(payload, callback) {
        return (dispatch) => {
            ApplicationService.updateSchedulerSettings(payload, data => {
                dispatch({
                    type: ActionTypes.UPDATED_SCHEDULE_SETTINGS,
                    data: {
                        schedulerMode: payload.SchedulerMode,
                        schedulerDelay: payload.SchedulerdelayAtAppStart
                    }
                });
                if (callback) {
                    callback(data);
                }
            });
        };
    },
    getScheduleItemHistory(searchParameters, callback) {
        return (dispatch) => {
            ApplicationService.getScheduleItemHistory(searchParameters, data => {
                dispatch({
                    type: ActionTypes.RETRIEVED_SCHEDULE_HISTORY,
                    data: {
                        taskHistoryList: data.Results,
                        totalCount: data.TotalResults
                    }
                });
                if (callback) {
                    callback(data);
                }
            });
        };
    },
    getSchedulerItemList(searchParameters, callback) {
        return (dispatch) => {
            ApplicationService.getScheduleItems(searchParameters, data => {
                dispatch({
                    type: ActionTypes.RETRIEVED_SCHEDULE_ITEMS,
                    data: {                        
                        schedulerItemList: data.Results,
                        totalCount: data.TotalResults
                    }
                });
                if (callback) {
                    callback(data);
                }
            });
        };
    },
    getServerList(callback) {
        return (dispatch) => {
            ApplicationService.getServerList(data => {
                dispatch({
                    type: ActionTypes.RETRIEVED_SERVER_LIST,
                    data: {
                        serverList: data.Results,
                        totalCount: data.TotalResults
                    }
                });
                if (callback) {
                    callback(data);
                }
            });
        };
    },
    getGetScheduleItem(searchParameters, callback) {
        return (dispatch) => {
            ApplicationService.getGetScheduleItem(searchParameters, data => {
                dispatch({
                    type: ActionTypes.RETRIEVED_SCHEDULE_ITEM,
                    data: {
                        scheduleItemDetail: data.Results,
                        totalCount: data.TotalResults
                    }
                });
                if (callback) {
                    callback(data);
                }
            });
        };
    },
    deleteSchedule(payload, schedulerItemList, callback) {
        return (dispatch) => {
            ApplicationService.deleteScheduleItem(payload, data => {
                dispatch({
                    type: ActionTypes.DELETED_SCHEDULE_ITEM,
                    data: {
                        schedulerItemList: schedulerItemList,
                        totalCount: schedulerItemList.length
                    }
                });
                if (callback) {
                    callback(data);
                }
            });
        };
    },
    createScheduleItem(payload, callback, failureCallback) {
        return (dispatch) => {
            ApplicationService.createScheduleItem(payload, data => {
                dispatch({
                    type: ActionTypes.CREATED_SCHEDULE_ITEM,
                    data: {
                        Success: data.Success
                    }
                });
                if (callback) {
                    callback(data);
                }
            }, data => {
                if (failureCallback) {
                    failureCallback(data);
                }
            });
        };
    },
    updateScheduleItem(payload, callback, failureCallback) {
        return (dispatch) => {
            ApplicationService.updateScheduleItem(payload, data => {
                dispatch({
                    type: ActionTypes.UPDATED_SCHEDULE_ITEM,
                    data: {
                        Success: data.Success
                    }
                });
                if (callback) {
                    callback(data);
                }
            }, data => {
                if (failureCallback) {
                    failureCallback(data);
                }
            });
        };
    },
    runScheduleItem(payload, callback) {
        return (dispatch) => {
            ApplicationService.runScheduleItem(payload, data => {
                dispatch({
                    type: ActionTypes.EXECUTED_SCHEDULE_ITEM,
                    data: {
                        Success: data.Success
                    }
                });
                if (callback) {
                    callback(data);
                }
            });
        };
    }
};

export default taskActions;