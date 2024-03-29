import axios from "axios";

const url2 = "https://crm.zdesquest.ru";
const url3 = url2;
// const url3 = "http://127.0.0.1:8000";

// GET
export const getQuestProfit = async (id: number) => {
  try {
    const url = `${url3}/api/quest-profit/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getAllUsers = async () => {
  try {
    const url = `${url3}/api/all-users/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getUsers = async () => {
  try {
    const url = `${url3}/api/users/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getCurrentUser = async () => {
  try {
    const url = `${url3}/api/user/current/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getUserSTQuests = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/user/stquests/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/user/stquests/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getUserSTExpenses = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/user/stexpenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/user/stexpenses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getUsersByRole = async (roleName: string) => {
  try {
    const url = `${url3}/api/users/${roleName}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getRoles = async () => {
  try {
    const url = `${url3}/api/roles/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getQuests = async () => {
  try {
    const url = `${url3}/api/quests/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getQuestsWithSpecVersions = async () => {
  try {
    const url = `${url3}/api/quests-with-special-versions/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getQuestsWithParentQuest = async () => {
  try {
    const url = `${url3}/api/quests-with-parent-quest/`;
    const res = await axios.get(url);
    return res;
  } catch (error) {
    return error.response.status;
  }
};

export const getQuestsWithoutParentQuest = async () => {
  try {
    const url = `${url3}/api/quests-without-parent-quest/`;
    const res = await axios.get(url);
    return res;
  } catch (error) {
    return error.response.status;
  }
};

export const getQuestVersions = async () => {
  try {
    const url = `${url3}/api/quest-versions/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getSTQuests = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/stquests/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/stquests/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getSTExpenses = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/stexpenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/stexpenses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getSTBonusesPenalties = async (
  startDate: string,
  endDate: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/stbonuses-penalties/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/stbonuses-penalties/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getSTExpenseCategories = async () => {
  try {
    const url = `${url3}/api/stexpense-categories/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getSTExpenseSubCategories = async () => {
  try {
    const url = `${url3}/api/stexpense-sub-categories/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
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
      url = `${url3}/api/quest/${id}/incomes/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/quest/${id}/incomes/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
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
      url = `${url3}/api/quest/${id}/expenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/quest/${id}/expenses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getQuestSalaries = async (
  startDate: string,
  endDate: string,
  id: number
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/quest/${id}/salaries/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/quest/${id}/salaries/`;
    }
    const res = await axios.get(url);
    return res;
  } catch (error) {
    return error.response.status;
  }
};

export const getSalaries = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/salaries/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/salaries/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getVideos = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/videos/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/videos/`;
    }
    const res = await axios.get(url);
    return res;
  } catch (error) {
    return error.response.status;
  }
};

export const getCurrentSalaries = async (
  startDate: string,
  endDate: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/salaries/current/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/salaries/current/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
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
      url = `${url3}/api/quest/${id}/cash-register/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/quest/${id}/cash-register/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getQuestCashRegisterDeposited = async (
  startDate: string,
  endDate: string,
  id: number
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/quest/${id}/cash-register-deposited/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/quest/${id}/cash-register-deposited/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getQuestCashRegisterTaken = async (
  startDate: string,
  endDate: string,
  id: number
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/quest/${id}/cash-register-taken/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/quest/${id}/cash-register-taken/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const toggleQuestCashRegister = async (id: number) => {
  try {
    const url = `${url3}/api/toggle/cash-register/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const toggleQuestVideo = async (id: number) => {
  try {
    const url = `${url3}/api/toggle/video/${id}/`;
    const res = await axios.get(url);
    return res;
  } catch (error) {
    return error.response.status;
  }
};

export const toggleCorrectnessOfsalary = async (value: object) => {
  try {
    const url = `${url3}/api/toggle/correctness-of-salary/`;
    const res = await axios.post(url, value);
    return res;
  } catch (error) {
    return error.response.status;
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
      url = `${url3}/api/quest/${id}/work-card-expenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/quest/${id}/work-card-expenses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getExpensesFromOwn = async (
  startDate: string,
  endDate: string,
  id: number
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/quest/${id}/expenses-from-own/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/quest/${id}/expenses-from-own/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getExpensesFromOwnAll = async (
  startDate: string,
  endDate: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/expenses-from-own/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/expenses-from-own/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getWorkCardExpensesAll = async (
  startDate: string,
  endDate: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `${url3}/api/work-card-expenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/work-card-expenses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
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
      url = `${url3}/api/quest/${id}/videos/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `${url3}/api/quest/${id}/videos/`;
    }
    const res = await axios.get(url);
    return res;
  } catch (error) {
    return error.response.status;
  }
};

export const toggleExpensesFromOwn = async (id: number) => {
  try {
    const url = `${url3}/api/toggle/expenses-from-own/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

// GET, PUT, DELETE
export const getUser = async (id: number) => {
  try {
    const url = `${url3}/api/user/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const putUser = async (id: number, value: object) => {
  try {
    const url = `${url3}/api/user/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const url = `${url3}/api/user/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getQuest = async (id: number) => {
  try {
    const url = `${url3}/api/quest/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const putQuest = async (id: number, value: object) => {
  try {
    const url = `${url3}/api/quest/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const deleteQuest = async (id: number) => {
  try {
    const url = `${url3}/api/quest/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getQuestVersion = async (id: number) => {
  try {
    const url = `${url3}/api/quest-version/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const putQuestVersion = async (id: number, value: object) => {
  try {
    const url = `${url3}/api/quest-version/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const deleteQuestVersion = async (id: number) => {
  try {
    const url = `${url3}/api/quest-version/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getSTQuest = async (stqid: number) => {
  try {
    const url = `${url3}/api/stquest/${stqid}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const putSTQuest = async (id: number, value: object) => {
  try {
    const url = `${url3}/api/stquest/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const deleteSTQuest = async (id: number) => {
  try {
    const url = `${url3}/api/stquest/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getSTExpense = async (id: number) => {
  try {
    const url = `${url3}/api/stexpense/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const putSTExpense = async (id: number, value: object, files: any) => {
  try {
    const url = `${url3}/api/stexpense/${id}/`;
    let formData = new FormData();
    formData.append("json", JSON.stringify(value));
    let res;
    if (files) {
      delete value.attachment;
      formData.append("files", files);
    }
    res = await axios.put(url, formData);
    return res;
  } catch (error) {
    return error.response.status;
  }
};

export const deleteSTExpense = async (id: number) => {
  try {
    const url = `${url3}/api/stexpense/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getSTBonusPenalty = async (id: number) => {
  try {
    const url = `${url3}/api/stbonus-penalty/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const putSTBonusPenalty = async (id: number, value: object) => {
  try {
    const url = `${url3}/api/stbonus-penalty/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const deleteSTBonusPenalty = async (id: number) => {
  try {
    const url = `${url3}/api/stbonus-penalty/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getSTExpenseCategory = async (id: number) => {
  try {
    const url = `${url3}/api/stexpense-category/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const putSTExpenseCategory = async (id: number, value: object) => {
  try {
    const url = `${url3}/api/stexpense-category/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const deleteSTExpenseCategory = async (id: number) => {
  try {
    const url = `${url3}/api/stexpense-category/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const getSTExpenseSubCategory = async (id: number) => {
  try {
    const url = `${url3}/api/stexpense-subcategory/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const putSTExpenseSubCategory = async (id: number, value: object) => {
  try {
    const url = `${url3}/api/stexpense-subcategory/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const deleteSTExpenseSubCategory = async (id: number) => {
  try {
    const url = `${url3}/api/stexpense-subcategory/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

// POST
export const token = async (value: object) => {
  try {
    const url = `${url3}/api/token/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const tokenRefresh = async (value: object) => {
  try {
    const url = `${url3}/api/token/refresh/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const postUser = async (value: object) => {
  try {
    const url = `${url3}/api/create/user/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const postQuest = async (value: object) => {
  try {
    const url = `${url3}/api/create/quest/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const postQuestVersion = async (value: object) => {
  try {
    const url = `${url3}/api/create/quest-version/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const postSTQuest = async (value: object) => {
  try {
    const url = `${url3}/api/create/stquest/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const postSTExpense = async (value: object, files: any) => {
  try {
    const url = `${url3}/api/create/stexpense/`;
    let formData = new FormData();
    formData.append("json", JSON.stringify(value));
    let res;
    if (files) {
      delete value.attachment;
      formData.append("files", files);
    }
    res = await axios.post(url, formData);
    return res;
  } catch (error) {
    return error.response.status;
  }
};

export const postSTBonusPenalty = async (value: object) => {
  try {
    const url = `${url3}/api/create/stbonus-penalty/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const postSTExpenseCategory = async (value: object) => {
  try {
    const url = `${url3}/api/create/stexpense-category/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const postSTExpenseSubCategory = async (value: object) => {
  try {
    const url = `${url3}/api/create/stexpense-subcategory/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};

export const postQCashRegister = async (value: object) => {
  try {
    const url = `${url3}/api/create/cash-register/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    return error.response.status;
  }
};
