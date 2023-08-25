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

export const getTransactions = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://127.0.0.1:8000/api/transactions/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://127.0.0.1:8000/api/transactions/`;
    }
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
      url = `http://127.0.0.1:8000/api/expenses/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://127.0.0.1:8000/api/expenses/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBonusesPenalties = async (startDate: string, endDate: string) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://127.0.0.1:8000/api/bonuses-penalties/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://127.0.0.1:8000/api/bonuses-penalties/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// GET, PUT, DELETE
export const getQuest = async (qname: string) => {
  try {
    const url = `http://127.0.0.1:8000/api/quest/${qname}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putQuest = async (qname: string, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/quest/${qname}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteQuest = async (qname: string) => {
  try {
    const url = `http://127.0.0.1:8000/api/quest/${qname}/`;
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

export const getQuestSalaries = async (
  qname: string,
  startDate: string,
  endDate: string
) => {
  try {
    let url;
    if (startDate !== null && endDate !== null) {
      url = `http://127.0.0.1:8000/api/quest/${qname}/salaries/?start_date=${startDate}&end_date=${endDate}`;
    } else {
      url = `http://127.0.0.1:8000/api/quest/${qname}/salaries/`;
    }
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTransaction = async (tid: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/transaction/${tid}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putTransaction = async (tid: number, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/transaction/${tid}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteTransaction = async (tid: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/transaction/${tid}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTQuest = async (stqid: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stquest/${stqid}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTQuest = async (stqid: number, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/stquest/${stqid}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTQuest = async (stqid: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/stquest/${stqid}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSTExpense = async (steid: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/expense/${steid}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putSTExpense = async (steid: number, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/expense/${steid}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteSTExpense = async (steid: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/expense/${steid}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getBonusPenalty = async (bpid: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/bonus-penalty/${bpid}/`;
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const putBonusPenalty = async (bpid: number, value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/bonus-penalty/${bpid}/`;
    const response = await axios.put(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteBonusPenalty = async (bpid: number) => {
  try {
    const url = `http://127.0.0.1:8000/api/bonus-penalty/${bpid}/`;
    const response = await axios.delete(url);
    return response;
  } catch (error) {
    throw error;
  }
};

// POST
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

export const postTransaction = async (value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/create/transaction/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};

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

export const postBonusPenalty = async (value: object) => {
  try {
    const url = `http://127.0.0.1:8000/api/create/stbonus-penalty/`;
    const response = await axios.post(url, value);
    return response;
  } catch (error) {
    throw error;
  }
};
