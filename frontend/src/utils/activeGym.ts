const KEY = "activeGymId";

export const getActiveGymId = () => sessionStorage.getItem(KEY);

export const setActiveGymId = (gymId: string | null) => {
    if (gymId) sessionStorage.setItem(KEY, gymId);
    else sessionStorage.removeItem(KEY);
}