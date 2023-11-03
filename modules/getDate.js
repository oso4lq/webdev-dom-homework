//  get date module

export const getNetworkDate = (networkDate) => {
    const date = new Date(networkDate).toLocaleString().slice(0, -3);
    return date;
}