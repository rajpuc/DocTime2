import { configureStore } from "@reduxjs/toolkit";
import settingReducer from "../StateSlice/SettingSlice";


export default configureStore({
    reducer: {
        settings: settingReducer,
    }
});
