import axios from "axios";

// GET
export const getQuestProfit = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/quest-profit/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const url = `https://crm.zdesquest.ru/api/users/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const url = `https://crm.zdesquest.ru/api/user/current/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUserSTQuests = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `https://crm.zdesquest.ru/api/user/stquests/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `https://crm.zdesquest.ru/api/user/stquests/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUsersByRole = async (roleName: string) => {
  try {
    const url = `https://crm.zdesquest.ru/api/users/${roleName}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const url = `https://crm.zdesquest.ru/api/roles/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuests = async () => {
  try {
    const url = `https://crm.zdesquest.ru/api/quests/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuestsWithSpecVersions = async () => {
  try {
    const url = `https://crm.zdesquest.ru/api/quests-with-spec-versions/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuestVersions = async () => {
  try {
    const url = `https://crm.zdesquest.ru/api/quest-versions/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTQuests = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `https://crm.zdesquest.ru/api/stquests/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `https://crm.zdesquest.ru/api/stquests/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpenses = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `https://crm.zdesquest.ru/api/stexpenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `https://crm.zdesquest.ru/api/stexpenses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTBonusesPenalties = async (
  startDate: string,
  endDate: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `https://crm.zdesquest.ru/api/stbonuses-penalties/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `https://crm.zdesquest.ru/api/stbonuses-penalties/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpenseCategories = async () => {
  try {
    const url = `https://crm.zdesquest.ru/api/stexpense-categories/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpenseSubCategories = async () => {
  try {
    const url = `https://crm.zdesquest.ru/api/stexpense-sub-categories/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuestIncomes = async (
  startDate: string,
  endDate: string,
  id: number
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `https://crm.zdesquest.ru/api/quest/${id}/incomes/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `https://crm.zdesquest.ru/api/quest/${id}/incomes/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuestExpenses = async (
  startDate: string,
  endDate: string,
  id: number
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `https://crm.zdesquest.ru/api/quest/${id}/expenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `https://crm.zdesquest.ru/api/quest/${id}/expenses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSalaries = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `https://crm.zdesquest.ru/api/salaries/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `https://crm.zdesquest.ru/api/salaries/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCurrentSalaries = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `https://crm.zdesquest.ru/api/salaries/current/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `https://crm.zdesquest.ru/api/salaries/current/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuestCashRegister = async (
  startDate: string,
  endDate: string,
  id: number
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `https://crm.zdesquest.ru/api/quest/${id}/cash-register/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `https://crm.zdesquest.ru/api/quest/${id}/cash-register/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const toggleQuestCashRegister = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/toggle/cash-register/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getWorkCardExpenses = async (
  startDate: string,
  endDate: string,
  id: number
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `https://crm.zdesquest.ru/api/quest/${id}/work-card-expenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `https://crm.zdesquest.ru/api/quest/${id}/work-card-expenses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getExpensesFromTheir = async (
  startDate: string,
  endDate: string,
  id: number
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `https://crm.zdesquest.ru/api/quest/${id}/expenses-from-their/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `https://crm.zdesquest.ru/api/quest/${id}/expenses-from-their/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQVideos = async (
  startDate: string,
  endDate: string,
  id: number
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `https://crm.zdesquest.ru/api/quest/${id}/videos/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `https://crm.zdesquest.ru/api/quest/${id}/videos/`;
    }
    const res = await axios.get(url);
    return res;
  } catch (error) {
    throw error;
  }
};

export const toggleExpensesFromTheir = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/toggle/expenses-from-their/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// GET, PUT, DELETE
export const getUser = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/user/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putUser = async (id: number, value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/user/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/user/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuest = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/quest/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putQuest = async (id: number, value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/quest/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteQuest = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/quest/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuestVersion = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/quest-version/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putQuestVersion = async (id: number, value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/quest-version/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteQuestVersion = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/quest-version/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTQuest = async (stqid: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stquest/${stqid}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTQuest = async (id: number, value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stquest/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTQuest = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stquest/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpense = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stexpense/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTExpense = async (id: number, value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stexpense/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTExpense = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stexpense/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTBonusPenalty = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stbonus-penalty/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTBonusPenalty = async (id: number, value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stbonus-penalty/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTBonusPenalty = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stbonus-penalty/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpenseCategory = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stexpense-category/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTExpenseCategory = async (id: number, value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stexpense-category/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTExpenseCategory = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stexpense-category/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpenseSubCategory = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stexpense-subcategory/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTExpenseSubCategory = async (id: number, value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stexpense-subcategory/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTExpenseSubCategory = async (id: number) => {
  try {
    const url = `https://crm.zdesquest.ru/api/stexpense-subcategory/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// POST
export const token = async (value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/token/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const tokenRefresh = async (value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/token/refresh/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postUser = async (value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/create/user/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postQuest = async (value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/create/quest/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postQuestVersion = async (value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/create/quest-version/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTQuest = async (value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/create/stquest/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTExpense = async (value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/create/stexpense/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTBonusPenalty = async (value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/create/stbonus-penalty/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTExpenseCategory = async (value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/create/stexpense-category/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTExpenseSubCategory = async (value: object) => {
  try {
    const url = `https://crm.zdesquest.ru/api/create/stexpense-subcategory/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};
