import axios from "axios";

// GET
export const getUsers = async () => {
  try {
    const url = `http://127.0.0.1:8000/api/users/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUsersByRole = async (roleName: string) => {
  try {
    const url = `http://127.0.0.1:8000/api/users/${roleName}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const url = `http://127.0.0.1:8000/api/roles/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuests = async () => {
  try {
    const url = `http://127.0.0.1:8000/api/quests/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// export const getTransactions = async (startDate: string, endDate: string) => {
//   try {
//     let url;
//     if (startDate !== null && endDate !== null) {
//       url = `http://127.0.0.1:8000/api/transactions/?start_date=${startDate}&end_date=${endDate}`;
//     } else {
//       url = `http://127.0.0.1:8000/api/transactions/`;
//     }
//     const response = await axios.get(url);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

export const getSTQuests = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://127.0.0.1:8000/api/stquests/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://127.0.0.1:8000/api/stquests/`;
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
      url = `http://127.0.0.1:8000/api/stexpenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://127.0.0.1:8000/api/stexpenses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTBonuses = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://127.0.0.1:8000/api/stbonuses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://127.0.0.1:8000/api/stbonuses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTPenalties = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://127.0.0.1:8000/api/stpenalties/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://127.0.0.1:8000/api/stpenalties/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpenseCategories = async () => {
  try {
    const url = `http://127.0.0.1:8000/api/stexpense-categories/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpenseSubCategories = async () => {
  try {
    const url = `http://127.0.0.1:8000/api/stexpense-sub-categories/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// GET, PUT, DELETE
export const getUser = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/user/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putUser = async (id: number, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/user/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/user/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuest = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/quest/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putQuest = async (id: number, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/quest/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteQuest = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/quest/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuestIncomes = async (
  qname: string,
  startDate: string,
  endDate: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://127.0.0.1:8000/api/quest/${qname}/incomes/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://127.0.0.1:8000/api/quest/${qname}/incomes/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuestExpenses = async (
  qname: string,
  startDate: string,
  endDate: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://127.0.0.1:8000/api/quest/${qname}/expenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://127.0.0.1:8000/api/quest/${qname}/expenses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSalaries = async (
  startDate: string,
  endDate: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://127.0.0.1:8000/api/salaries/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://127.0.0.1:8000/api/salaries/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// export const getTransaction = async (tid: number) => {
//   try {
//     const url = `http://127.0.0.1:8000/api/transaction/${tid}/`;
//     const response = await axios.get(url);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const putTransaction = async (tid: number, value: object) => {
//   try {
//     const url = `http://127.0.0.1:8000/api/transaction/${tid}/`;
//     const response = await axios.put(url, value);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const deleteTransaction = async (tid: number) => {
//   try {
//     const url = `http://127.0.0.1:8000/api/transaction/${tid}/`;
//     const response = await axios.delete(url);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

export const getSTQuest = async (stqid: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stquest/${stqid}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTQuest = async (id: number, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/stquest/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTQuest = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stquest/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpense = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stexpense/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTExpense = async (id: number, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/stexpense/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTExpense = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stexpense/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTBonus = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stbonus/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTBonus = async (id: number, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/stbonus/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTBonus = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stbonus/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTPenalty = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stpenalty/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTPenalty = async (id: number, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/stpenalty/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTPenalty = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stpenalty/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpenseCategory = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stexpense-category/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTExpenseCategory = async (id: number, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/stexpense-category/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTExpenseCategory = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stexpense-category/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpenseSubCategory = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stexpense-subcategory/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTExpenseSubCategory = async (id: number, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/stexpense-subcategory/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTExpenseSubCategory = async (id: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stexpense-subcategory/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// POST
export const token = async (value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/token/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const tokenRefresh = async (value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/token/refresh/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postUser = async (value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/create/user/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postQuest = async (value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/create/quest/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

// export const postTransaction = async (value: object) => {
//   try {
//     const url = `http://127.0.0.1:8000/api/create/transaction/`;
//     const response = await axios.post(url, value);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

export const postSTQuest = async (value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/create/stquest/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTExpense = async (value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/create/stexpense/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTBonus = async (value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/create/stbonus/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTPenalty = async (value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/create/stpenalty/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTExpenseCategory = async (value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/create/stexpense-category/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTExpenseSubCategory = async (value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/create/stexpense-subcategory/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};
