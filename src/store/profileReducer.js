// Initial state for our Redux-like store
export const initialState = {
  activeTab: 'Overview',
  isLoading: false,
};

// Reducer function to handle state transitions
export function profileReducer(state, action) {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      // Start loading state to show the smooth transition animation
      return { ...state, isLoading: true };
    case 'TAB_LOADED':
      // Transition complete, set the new active tab
      return { ...state, activeTab: action.payload, isLoading: false };
    default:
      return state;
  }
}
