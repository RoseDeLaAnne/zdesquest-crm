import axios from "axios";

// GET
export const getUsers = async () => {
  try {
    const url = `http://crm.zdesquest.ru/api/users/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const url = `http://crm.zdesquest.ru/api/user/current/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUsersByRole = async (roleName: string) => {
  try {
    const url = `http://crm.zdesquest.ru/api/users/${roleName}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const url = `http://crm.zdesquest.ru/api/roles/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuests = async () => {
  try {
    const url = `http://crm.zdesquest.ru/api/quests/`;
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
//       url = `http://crm.zdesquest.ru/api/transactions/?start_date=${startDate}&end_date=${endDate}`;
//     } else {
//       url = `http://crm.zdesquest.ru/api/transactions/`;
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
      url = `http://crm.zdesquest.ru/api/stquests/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://crm.zdesquest.ru/api/stquests/`;
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
      url = `http://crm.zdesquest.ru/api/stexpenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://crm.zdesquest.ru/api/stexpenses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTBonusesPenalties = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://crm.zdesquest.ru/api/stbonuses-penalties/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://crm.zdesquest.ru/api/stbonuses-penalties/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// export const getSTBonuses = async (startDate: string, endDate: string) => {
//   try {
//     let url;
//     if (startDate !== null && endDate !== null) {
//       url = `http://crm.zdesquest.ru/api/stbonuses/?start_date=${startDate}&end_date=${endDate}`;
//     } else {
//       url = `http://crm.zdesquest.ru/api/stbonuses/`;
//     }
//     const response = await axios.get(url);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getSTPenalties = async (startDate: string, endDate: string) => {
//   try {
//     let url;
//     if (startDate !== null && endDate !== null) {
//       url = `http://crm.zdesquest.ru/api/stpenalties/?start_date=${startDate}&end_date=${endDate}`;
//     } else {
//       url = `http://crm.zdesquest.ru/api/stpenalties/`;
//     }
//     const response = await axios.get(url);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

export const getSTExpenseCategories = async () => {
  try {
    const url = `http://crm.zdesquest.ru/api/stexpense-categories/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpenseSubCategories = async () => {
  try {
    const url = `http://crm.zdesquest.ru/api/stexpense-sub-categories/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuestIncomes = async (  
  startDate: string,
  endDate: string,
  name: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://crm.zdesquest.ru/api/quest/${name}/incomes/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://crm.zdesquest.ru/api/quest/${name}/incomes/`;
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
  name: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://crm.zdesquest.ru/api/quest/${name}/expenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://crm.zdesquest.ru/api/quest/${name}/expenses/`;
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
      url = `http://crm.zdesquest.ru/api/salaries/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://crm.zdesquest.ru/api/salaries/`;
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
  name: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://crm.zdesquest.ru/api/quest/${name}/cash-register/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://crm.zdesquest.ru/api/quest/${name}/cash-register/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const toggleQuestCashRegister = async (
  id: number
) => {
  try {
    const url = `http://crm.zdesquest.ru/api/toggle/cash-register/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getWorkCardExpenses = async (
  startDate: string,
  endDate: string,
  name: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://crm.zdesquest.ru/api/quest/${name}/work-card-expenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://crm.zdesquest.ru/api/quest/${name}/work-card-expenses/`;
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
  name: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://crm.zdesquest.ru/api/quest/${name}/expenses-from-their/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://crm.zdesquest.ru/api/quest/${name}/expenses-from-their/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const toggleExpensesFromTheir = async (
  id: number
) => {
  try {
    const url = `http://crm.zdesquest.ru/api/toggle/expenses-from-their/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// GET, PUT, DELETE
export const getUser = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/user/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putUser = async (id: number, value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/user/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/user/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getQuest = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/quest/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putQuest = async (id: number, value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/quest/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteQuest = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/quest/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTQuest = async (stqid: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stquest/${stqid}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTQuest = async (id: number, value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stquest/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTQuest = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stquest/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpense = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stexpense/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTExpense = async (id: number, value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stexpense/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTExpense = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stexpense/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTBonusPenalty = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stbonus-penalty/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTBonusPenalty = async (id: number, value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stbonus-penalty/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTBonusPenalty = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stbonus-penalty/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// export const getSTBonus = async (id: number) => {
//   try {
//     const url = `http://crm.zdesquest.ru/api/stbonus/${id}/`;
//     const response = await axios.get(url);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const putSTBonus = async (id: number, value: object) => {
//   try {
//     const url = `http://crm.zdesquest.ru/api/stbonus/${id}/`;
//     const response = await axios.put(url, value);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const deleteSTBonus = async (id: number) => {
//   try {
//     const url = `http://crm.zdesquest.ru/api/stbonus/${id}/`;
//     const response = await axios.delete(url);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getSTPenalty = async (id: number) => {
//   try {
//     const url = `http://crm.zdesquest.ru/api/stpenalty/${id}/`;
//     const response = await axios.get(url);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const putSTPenalty = async (id: number, value: object) => {
//   try {
//     const url = `http://crm.zdesquest.ru/api/stpenalty/${id}/`;
//     const response = await axios.put(url, value);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const deleteSTPenalty = async (id: number) => {
//   try {
//     const url = `http://crm.zdesquest.ru/api/stpenalty/${id}/`;
//     const response = await axios.delete(url);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

export const getSTExpenseCategory = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stexpense-category/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTExpenseCategory = async (id: number, value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stexpense-category/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTExpenseCategory = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stexpense-category/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpenseSubCategory = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stexpense-subcategory/${id}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTExpenseSubCategory = async (id: number, value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stexpense-subcategory/${id}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTExpenseSubCategory = async (id: number) => {
  try {
    const url = `http://crm.zdesquest.ru/api/stexpense-subcategory/${id}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// POST
export const token = async (value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/token/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const tokenRefresh = async (value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/token/refresh/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postUser = async (value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/create/user/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postQuest = async (value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/create/quest/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTQuest = async (value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/create/stquest/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTExpense = async (value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/create/stexpense/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTBonusPenalty = async (value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/create/stbonus-penalty/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

// export const postSTBonus = async (value: object) => {
//   try {
//     const url = `http://crm.zdesquest.ru/api/create/stbonus/`;
//     const response = await axios.post(url, value);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const postSTPenalty = async (value: object) => {
//   try {
//     const url = `http://crm.zdesquest.ru/api/create/stpenalty/`;
//     const response = await axios.post(url, value);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

export const postSTExpenseCategory = async (value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/create/stexpense-category/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postSTExpenseSubCategory = async (value: object) => {
  try {
    const url = `http://crm.zdesquest.ru/api/create/stexpense-subcategory/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};