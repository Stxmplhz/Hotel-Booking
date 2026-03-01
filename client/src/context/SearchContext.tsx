import { createContext, useReducer } from "react";
import type { ReactNode, Dispatch } from "react";

interface SearchState {
    city: string | undefined;
    dates: { startDate: Date; endDate: Date }[];
    options: {
        adult: number;
        children: number;
        room: number;
    };
}

type Action =
    | { type: "NEW_SEARCH"; payload: SearchState }
    | { type: "RESET_SEARCH" };

const INITIAL_STATE: SearchState = {
    city: undefined,
    dates: [],
    options: {
        adult: 1,
        children: 0,
        room: 1,
    },
};

export const SearchContext = createContext<{
    city: string | undefined;
    dates: { startDate: Date; endDate: Date }[];
    options: { adult: number; children: number; room: number };
    dispatch: Dispatch<Action>;
}>({
    ...INITIAL_STATE,
    dispatch: () => null,
});

const SearchReducer = (state: SearchState, action: Action) => {
    switch (action.type) {
        case "NEW_SEARCH":
        return action.payload;
        case "RESET_SEARCH":
        return INITIAL_STATE;
        default:
        return state;
    }
};

export const SearchContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(SearchReducer, INITIAL_STATE);

    return (
        <SearchContext.Provider
        value={{
            city: state.city,
            dates: state.dates,
            options: state.options,
            dispatch,
        }}
        >
        {children}
        </SearchContext.Provider>
    );
};