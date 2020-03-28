export const getSelectOptions = (store, labelProperty = 'name', valueProperty = 'id') => {

    if (!store) {
        return null;
    }

    return store.map(item => {
        return {
            label: item[labelProperty],
            value: item[valueProperty]
        }
    }).sort((a, b) => a.label > b.label ? 1 : -1);
};

export const getSelectOption = (store, value, labelProperty = 'name') => {

    const storeValue = store.find(item => item.name === value);

    return {
        label: storeValue ? storeValue[labelProperty] : null,
        value: value
    }
};