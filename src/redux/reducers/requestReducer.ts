import { createSlice } from '@reduxjs/toolkit';

const sliceReducer = createSlice({
    name: 'news',
    initialState: {
        news: [],
    },
    reducers: {
        addNews(state, action) {
            state.news = state.news.concat(action.payload);
        },
    },
});
export default sliceReducer.reducer;
export const { addNews } = sliceReducer.actions;
